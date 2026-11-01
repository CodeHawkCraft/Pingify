export type EmailContent = { subject: string; text: string; html: string };

type AlertEmailData = {
  type: "down" | "up";
  name: string;
  url: string;
  reason: string;
  created_at: string | Date;
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function alertEmail({ type, name, url, reason, created_at }: AlertEmailData): EmailContent {
  const isDown = type === "down";
  const headline = isDown ? `${name} is not responding.` : `${name} is responding again.`;
  const rows: [string, string][] = [
    ["URL", url],
    [isDown ? "Reason" : "Outage", reason],
    ["Time", new Date(created_at).toUTCString()],
  ];

  return {
    subject: isDown ? `🔴 ${name} is DOWN` : `🟢 ${name} is back UP`,
    text: [headline, "", ...rows.map(([k, v]) => `${`${k}:`.padEnd(8)}${v}`)].join("\n"),
    html: `<div style="font-family:sans-serif">
  <h2 style="color:${isDown ? "#dc2626" : "#16a34a"}">${escapeHtml(headline)}</h2>
  <table>${rows
    .map(([k, v]) => `<tr><td style="padding-right:12px"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
</div>`,
  };
}
