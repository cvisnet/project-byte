import "server-only";

import nodemailer from "nodemailer";

type Transporter = ReturnType<typeof nodemailer.createTransport>;

let cached: Transporter | null = null;

export function getTransporter(): Transporter {
  if (cached) return cached;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error(
      "SMTP configuration missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.",
    );
  }

  const portNum = Number(port);
  cached = nodemailer.createTransport({
    host,
    port: portNum,
    secure: portNum === 465,
    auth: { user, pass },
  });

  return cached;
}

export function getFromAddress(): string {
  return process.env.SMTP_FROM || "Project BYTE <no-reply@ishare.com.ph>";
}

export function getContactToAddress(): string {
  return process.env.CONTACT_TO_EMAIL || "support@ishare.com.ph";
}
