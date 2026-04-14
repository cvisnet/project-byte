import { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db";
import { AdminRole } from "./generated/prisma/enums";
import nodemailer from "nodemailer";

declare module "next-auth" {
  interface Session {
    user: {
      role: AdminRole;
      isSuspended: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: AdminRole;
    isSuspended: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/admin",
  },

  session: {
    strategy: "jwt", // REQUIRED for proxy
  },

  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.SMTP_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const transport = nodemailer.createTransport(provider.server);
        const host = new URL(url).host;

        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
              <h2 style="margin: 0 0 12px;">Project BYTE Login</h2>
              <p style="margin: 0 0 16px;">Click the button below to sign in.</p>
              <a href="${url}" style="display: inline-block; padding: 10px 16px; border-radius: 8px; text-decoration: none; background: #111827; color: #ffffff;">
                Sign In
              </a>
              <p style="margin: 16px 0 0; font-size: 12px; color: #6b7280;">
                If the button does not work, copy and paste this URL into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #6b7280; word-break: break-all;">${url}</p>
            </div>
          `,
        });
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Runs on sign in
      if (user) {
        token.role = user.role;
        token.isSuspended = user.isSuspended;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as AdminRole;
        session.user.isSuspended = token.isSuspended as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const urlObj = new URL(url, baseUrl);

      if (urlObj.pathname.startsWith("/api/auth")) {
        return `${baseUrl}/admin`;
      }

      if (urlObj.origin === baseUrl) {
        return urlObj.toString();
      }

      return `${baseUrl}/admin`;
    },
  },
};
