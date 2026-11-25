import nodemailer from "nodemailer";
import env from "../env.ts";
import type { EmailContent } from "./emailTemplates.ts";

// Email is optional: without SMTP creds alerts are still recorded, just not emailed.
const mailer =
  env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null;

if (!mailer) console.warn("SMTP_USER/SMTP_PASS not set: alerts will be recorded but not emailed");

export const canSendEmail = mailer !== null;

export async function sendEmail(to: string, { subject, text, html }: EmailContent) {
  if (!mailer) return;
  await mailer.sendMail({ from: `Pingify Alerts <${env.SMTP_USER}>`, to, subject, text, html });
}
