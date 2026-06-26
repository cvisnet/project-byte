"use server";

import escapeHtml from "escape-html";
import { headers } from "next/headers";
import { z } from "zod";

import {
  getContactToAddress,
  getFromAddress,
  getTransporter,
} from "@/lib/mail/transporter";
import { checkRateLimit } from "@/lib/rate-limit";

const Schema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().email("Please enter a valid email.").max(254),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Message is too long."),
});

export type SendContactMessageResult = { ok: true } | { ok: false; error: string };

async function getCallerIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export async function sendContactMessage(
  formData: FormData,
): Promise<SendContactMessageResult> {
  const honeypot = (formData.get("company") as string | null) ?? "";
  if (honeypot.trim().length > 0) {
    return { ok: true };
  }

  const parsed = Schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Please check the form and try again.",
    };
  }

  const ip = await getCallerIp();
  const rl = checkRateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const { name, email, message } = parsed.data;

  try {
    const transporter = getTransporter();
    const to = getContactToAddress();
    const from = getFromAddress();

    const text = `New contact form message\n\nFrom: ${name} <${email}>\n\n${message}\n`;
    const html = `<p><strong>New contact form message</strong></p>
<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>`;

    await transporter.sendMail({
      from,
      to,
      replyTo: `${name} <${email}>`,
      subject: `Contact form: ${name}`,
      text,
      html,
    });

    return { ok: true };
  } catch (err) {
    console.error("sendContactMessage error:", err);
    return { ok: false, error: "Could not send message. Please try again." };
  }
}
