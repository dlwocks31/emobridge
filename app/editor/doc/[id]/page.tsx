import { DocShow } from "@/components/roots/DocShow";

export default function Index({ params }: { params: { id: string } }) {
  return <DocShow id={params.id} user={null} />;
}
