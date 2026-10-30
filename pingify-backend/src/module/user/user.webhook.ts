import type { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { db, TABLES } from "../../database/db.ts";
import env from "../../env.ts";

// Clerk calls this on sign-up/update/deletion so the users row exists before the user's first API request.
export async function handleClerkWebhook(req: Request, res: Response) {
  let event;
  try {
    event = await verifyWebhook(req, { signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET });
  } catch {
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const { id, first_name, last_name, email_addresses, primary_email_address_id } = event.data;
    const email = email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ?? null;
    await db(TABLES.USERS)
      .insert({ id, first_name, last_name, email })
      .onConflict("id")
      .merge({ first_name, last_name, email, updated_at: db.fn.now() });
  }

  // websites and ping_logs are removed by ON DELETE CASCADE.
  if (event.type === "user.deleted" && event.data.id) {
    await db(TABLES.USERS).where({ id: event.data.id }).delete();
  }

  res.json({ ok: true });
}
