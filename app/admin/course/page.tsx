import { Database } from "@/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { CourseAccessEdit } from "./CourseAccessEdit";
export default async function Index() {
  const supabase = createServerComponentClient<Database>(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  );
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("id");

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  return (
    <div>
      <div className="text-center font-bold text-lg p-4">수업 접근권한:</div>
      {courses && <CourseAccessEdit courses={courses} users={users} />}
    </div>
  );
}
