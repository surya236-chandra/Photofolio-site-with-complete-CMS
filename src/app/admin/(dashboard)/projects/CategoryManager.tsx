import { Plus } from "lucide-react";
import { DeleteButton, SubmitButton } from "@/components/admin/ui";
import { createCategory, deleteCategory } from "@/app/admin/actions";

type Cat = { id: string; name: string; slug: string; _count: { projects: number } };

export default function CategoryManager({ categories }: { categories: Cat[] }) {
  return (
    <div className="surface h-fit p-5">
      <h2 className="font-semibold">Categories</h2>
      <p className="mb-3 text-sm text-muted">Used to filter the work page.</p>

      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-[var(--radius)] bg-surface2 px-3 py-2">
            <span className="text-sm">{c.name} <span className="text-muted">({c._count.projects})</span></span>
            <DeleteButton action={deleteCategory.bind(null, c.id)} iconOnly confirm={`Delete category "${c.name}"?`} />
          </div>
        ))}
        {categories.length === 0 && <p className="text-sm text-muted">No categories.</p>}
      </div>

      <form action={createCategory} className="mt-4 flex gap-2">
        <input name="name" placeholder="New category" required className="input" />
        <SubmitButton className="btn btn-accent shrink-0"><Plus size={16} /></SubmitButton>
      </form>
    </div>
  );
}
