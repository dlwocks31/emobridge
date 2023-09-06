import { DocShow } from "@/components/roots/DocShow";

export default async function Index({ params }: { params: { id: string } }) {
  return <DocShow id={params.id} />;
}
