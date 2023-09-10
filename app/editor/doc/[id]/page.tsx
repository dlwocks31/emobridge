import { DocShow } from "@/components/roots/DocShow";

export default function Index({ params }: { params: { id: string } }) {
  const userRole = "editor";

  return <DocShow id={params.id} userRole={userRole}/>;
}
 