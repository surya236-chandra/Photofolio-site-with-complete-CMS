import { createPage } from "@/app/admin/actions";
import PageForm from "../PageForm";

export const dynamic = "force-dynamic";

export default function NewPagePage() {
  return <PageForm action={createPage} />;
}
