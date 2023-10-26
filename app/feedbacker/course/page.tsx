import { CourseIndex } from "@/components/roots/CourseIndex";
import { roleAuthenticate } from "@/utils/role-authenticate";

export default async function Index() {
  const user = await roleAuthenticate(`/course`, "feedbacker");
  return <CourseIndex at="feedbacker" user={user} />;
}
