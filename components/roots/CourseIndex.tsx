import Link from "next/link";

// TODO: get userId
export const mockCourses = [
  {
    id: 1,
    name: "말하기와 토론",
  },
  {
    id: 2,
    name: "심리학개론",
  },
];

export const mockDocs = [
  {
    id: 1,
    courseId: 1,
    name: "말하기와 토론 1주차",
    createdAt: new Date(),
  },
  {
    id: 2,
    courseId: 1,
    name: "말하기와 토론 2주차",
    createdAt: new Date(),
  },
  {
    id: 3,
    courseId: 2,
    name: "심리학개론 1주차",
    createdAt: new Date(),
  },
  {
    id: 4,
    courseId: 2,
    name: "심리학개론 2주차",
    createdAt: new Date(),
  },
];
export function CourseIndex({ at }: { at: "editor" | "feedbacker" }) {
  return (
    <div>
      <h1>수업 목록</h1>
      {mockCourses.map((c) => (
        <div key={c.id}>
          <Link className="btn" href={`/${at}/course/${c.id}`}>
            {c.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
