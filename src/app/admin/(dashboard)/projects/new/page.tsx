import { prisma } from "@/lib/db";
import { createProject } from "@/app/admin/actions";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return <ProjectForm categories={categories} action={createProject} />;
}
