import { Mail, MailOpen, Reply } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { DeleteButton, SubmitButton } from "@/components/admin/ui";
import { toggleMessageRead, deleteMessage } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function MessagesAdminPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="display text-2xl font-bold md:text-3xl">Messages</h1>
        <p className="mt-1 text-muted">
          {messages.length} total{unread > 0 ? ` · ${unread} unread` : ""}. Submitted via the contact form.
        </p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="surface p-8 text-center text-muted">No messages yet.</div>
        )}
        {messages.map((m) => {
          const subject = m.subject || `Message from ${m.name}`;
          const mailto = `mailto:${m.email}?subject=${encodeURIComponent("Re: " + subject)}`;
          return (
            <div key={m.id} className={`surface p-5 ${!m.read ? "border-l-4 border-l-accent" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {m.name}
                    {!m.read && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accentFg">New</span>}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-muted hover:text-fg">{m.email}</a>
                </div>
                <span className="text-xs text-muted">{formatDate(m.createdAt)}</span>
              </div>

              {m.subject && <p className="mt-3 font-medium">{m.subject}</p>}
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{m.body}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={mailto} className="btn btn-accent !py-2"><Reply size={15} /> Reply</a>
                <form action={toggleMessageRead.bind(null, m.id, !m.read)}>
                  <SubmitButton className="btn btn-ghost !py-2">
                    {m.read ? <><Mail size={15} /> Mark unread</> : <><MailOpen size={15} /> Mark read</>}
                  </SubmitButton>
                </form>
                <DeleteButton action={deleteMessage.bind(null, m.id)} confirm="Delete this message?" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
