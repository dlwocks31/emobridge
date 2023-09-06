import { CourseShow } from "@/components/roots/CourseShow";

export default function Index({ params }: { params: { id: string } }) {
  return <CourseShow id={params.id} at="feedbacker" />;
}
