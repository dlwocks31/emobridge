import { CourseShow } from "@/components/roots/CourseShow";
import { roleAuthenticate } from "@/utils/role-authenticate";

export default async function Index({ params }: { params: { id: string } }) {
  const user = await roleAuthenticate(`course/${params.id}`, "feedbacker");
  return <CourseShow id={params.id} at="feedbacker" user={user} />;
}
