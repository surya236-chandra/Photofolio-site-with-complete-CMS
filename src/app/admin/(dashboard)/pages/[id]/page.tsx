import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updatePage } from "@/app/admin/actions";
import PageForm from "../PageForm";

export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();
  return <PageForm page={page} action={updatePage.bind(null, id)} />;
}
