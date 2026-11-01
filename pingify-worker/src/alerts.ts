import redisClient from "./redis.ts";
import { db, TABLES } from "./db.ts";
import env from "./env.ts";
import { sendEmail, canSendEmail } from "./utils/mailer.ts";
import { alertEmail } from "./utils/emailTemplates.ts";

const ALERT_STREAM = "pingify:alerts";
const ALERT_CONSUMER = "alerts-1";
const FAIL_THRESHOLD = 3; // consecutive failed pings before a site counts as down
const RETRY_DELAY_MS = 30_000;


export async function trackStatus(websiteId: string, isUp: boolean, reason?: string) {
  if (!isUp) {
    const fails = await redisClient.incr(`fails:${websiteId}`);
    if (fails !== FAIL_THRESHOLD) return;
    await redisClient.set(`down:${websiteId}`, Date.now().toString());
    await raiseAlert(websiteId, "down", reason ?? "Unknown error");
    return;
  }

  await redisClient.del(`fails:${websiteId}`);
  const downSince = await redisClient.getDel(`down:${websiteId}`);
  if (downSince) {
    await raiseAlert(websiteId, "up", `Down for ${formatDuration(Date.now() - Number(downSince))}`);
  }
}

async function raiseAlert(websiteId: string, type: "down" | "up", reason: string) {
  const [alert] = await db(TABLES.ALERTS)
    .insert({ website_id: websiteId, type, reason })
    .returning("id");
  // Queue the email so a slow/broken SMTP never delays pings.
  await redisClient.xAdd(ALERT_STREAM, "*", { alert_id: alert.id });
}

async function sendAlert(alertId: string) {
  const alert = await db(TABLES.ALERTS)
    .join(TABLES.WEBSITES, `${TABLES.WEBSITES}.id`, `${TABLES.ALERTS}.website_id`)
    .join(TABLES.USERS, `${TABLES.USERS}.id`, `${TABLES.WEBSITES}.user_id`)
    .where(`${TABLES.ALERTS}.id`, alertId)
    .first(
      `${TABLES.ALERTS}.type`,
      `${TABLES.ALERTS}.reason`,
      `${TABLES.ALERTS}.created_at`,
      `${TABLES.ALERTS}.sent_at`,
      `${TABLES.WEBSITES}.name`,
      `${TABLES.WEBSITES}.url`,
      `${TABLES.USERS}.email`,
    );

  // Website deleted (row cascaded away), already sent on a previous attempt, or nowhere to send.
  if (!alert || alert.sent_at || !alert.email || !canSendEmail) return;

  await sendEmail(alert.email, alertEmail(alert));

  await db(TABLES.ALERTS).where({ id: alertId }).update({ sent_at: db.fn.now() });
}

export async function startAlertConsumer() {
  try {
    await redisClient.xGroupCreate(ALERT_STREAM, env.REDIS_GROUP_NAME, "0", { MKSTREAM: true });
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("BUSYGROUP")) throw err;
  }

  // "0" = re-read our own pending (unacked) alerts, ">" = new ones.
  // Start with "0" so alerts left pending by a crash or failed send get retried.
  let id = "0";
  while (true) {
    try {
      const res = await redisClient.xReadGroup(
        env.REDIS_GROUP_NAME,
        ALERT_CONSUMER,
        { key: ALERT_STREAM, id },
        { COUNT: 10, BLOCK: 5000 },
      );
      const messages = (res as { messages: { id: string; message: Record<string, string> }[] }[] | null)?.[0]?.messages ?? [];

      if (id === "0" && messages.length === 0) {
        id = ">"; // pending backlog drained
        continue;
      }

      let failed = false;
      for (const m of messages) {
        try {
          await sendAlert(m.message.alert_id);
          await redisClient.xAck(ALERT_STREAM, env.REDIS_GROUP_NAME, m.id);
        } catch (err) {
          // SMTP 5xx = permanent (bad address etc.), retrying won't help: drop it.
          const code = (err as { responseCode?: number }).responseCode;
          if (code && code >= 500) {
            await redisClient.xAck(ALERT_STREAM, env.REDIS_GROUP_NAME, m.id);
          } else {
            failed = true; // transient: leave pending, retried below
          }
          console.error(`Failed to send alert ${m.message.alert_id}:`, err);
        }
      }

      if (failed) {
        id = "0";
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    } catch (err) {
      console.error("Alert consumer error:", err);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
}

function formatDuration(ms: number) {
  const s = Math.round(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return [h && `${h}h`, m && `${m}m`, `${s % 60}s`].filter(Boolean).join(" ");
}
