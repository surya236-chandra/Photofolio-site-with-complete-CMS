import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateProject } from "@/app/admin/actions";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!project) notFound();

  return (
    <ProjectForm
      project={project}
      categories={categories}
      action={updateProject.bind(null, id)}
    />
  );
}
