import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="display text-3xl font-bold">Surya Chandra</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your site</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-muted">
          Demo: admin@studio.test / admin123
        </p>
      </div>
    </div>
  );
}
