import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendContactMail } from "@/lib/mail";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email required").max(160),
  subject: z.string().max(160).optional().or(z.literal("")),
  body: z.string().min(5, "Message is too short").max(5000),
  // honeypot — bots fill this, humans don't
  company: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, subject, body, company } = parsed.data;

  // Honeypot triggered — pretend success, save nothing.
  if (company) return NextResponse.json({ ok: true });

  await prisma.message.create({
    data: { name, email, subject: subject || null, body },
  });

  // Best-effort email (no-op when SMTP isn't configured / offline).
  await sendContactMail({ name, email, subject: subject || undefined, body });

  return NextResponse.json({ ok: true });
}
