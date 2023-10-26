import { DocShow } from "@/components/roots/DocShow";
import { roleAuthenticate } from "@/utils/role-authenticate";

export default async function Index({ params }: { params: { id: string } }) {
  const user = await roleAuthenticate(`/doc/${params.id}`, "editor");

  return <DocShow id={params.id} userRole="editor" user={user} />;
}
