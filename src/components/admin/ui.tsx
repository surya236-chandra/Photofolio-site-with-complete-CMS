"use client";

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";

export function SubmitButton({
  children,
  className = "btn btn-accent",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`}>
      {pending && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function DeleteButton({
  action,
  label = "Delete",
  confirm = "Are you sure? This cannot be undone.",
  iconOnly = false,
}: {
  action: () => void | Promise<void>;
  label?: string;
  confirm?: string;
  iconOnly?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className={
          iconOnly
            ? "flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-muted hover:bg-surface2 hover:text-red-500"
            : "btn btn-ghost !text-red-500"
        }
        aria-label={label}
        title={label}
      >
        <Trash2 size={16} />
        {!iconOnly && <span>{label}</span>}
      </button>
    </form>
  );
}
