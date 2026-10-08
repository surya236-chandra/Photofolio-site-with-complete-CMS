"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} className="surface flex flex-col gap-4 p-6">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoFocus className="input" placeholder="you@studio.test" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required className="input" placeholder="••••••••" />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-accent disabled:opacity-60">
        {pending ? "Signing in..." : <>Sign in <LogIn size={16} /></>}
      </button>
    </form>
  );
}
