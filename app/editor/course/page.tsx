import { CourseIndex } from "@/components/roots/CourseIndex";
import { roleAuthenticate } from "@/utils/role-authenticate";

export default async function Index() {
  const user = await roleAuthenticate(`/course`, "editor");
  return <CourseIndex at="editor" user={user} />;
}
