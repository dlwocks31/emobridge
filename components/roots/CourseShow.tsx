import Link from "next/link";
import { mockCourses, mockDocs } from "./CourseIndex";

export function CourseShow({
  id,
  at,
}: {
  id: string;
  at: "feedbacker" | "editor";
}) {
  const course = mockCourses.find((c) => c.id === Number(id));
  if (!course) {
    return <div>Class not found</div>;
  }
  const docs = mockDocs.filter((d) => d.courseId === course.id);
  return (
    <div>
      <div>Course Name: {course.name}</div>
      <div>Docs:</div>
      {docs.map((d) => (
        <div key={d.id}>
          <Link className="btn" href={`/${at}/doc/${d.id}`}>
            {d.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
