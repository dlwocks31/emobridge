import { DocShow } from "@/components/roots/DocShow";

export default async function Index({ params }: { params: { id: string } }) {
  const userRole = "feedbacker";

  return <DocShow id={params.id} userRole={userRole}/>;
}
