import dayjs from "dayjs";
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
    <div className="flex flex-col gap-2">
      <div className="text-xl font-bold">수업: {course.name}</div>
      <div className="text-lg font-bold">문서:</div>
      {docs.map((d) => (
        <div key={d.id}>
          <Link
            className="btn w-full flex justify-between px-4"
            href={`/${at}/doc/${d.id}`}
          >
            <div>{d.name}</div>
            <div>{dayjs(d.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
