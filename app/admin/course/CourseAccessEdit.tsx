"use client";
import { Database } from "@/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import Select from "react-select";
export function CourseAccessEdit({
  users,
  courses,
}: {
  users: User[];
  courses: { id: number; name: string; userEmails: string[] }[];
}) {
  const supabase = createClientComponentClient<Database>();
  const options = users.map((u) => ({ value: u.email!, label: u.email! }));

  return (
    <div>
      {courses.map((c) => (
        <div key={c.id} className="flex gap-2 px-4">
          <div className="w-36 text-center">{c.name}</div>
          <div className="flex-1">
            <Select
              isMulti
              options={options}
              defaultValue={c.userEmails.map((e) => ({
                value: e,
                label: e,
              }))}
              onChange={async (selected) => {
                const { error } = await supabase
                  .from("courses")
                  .update({ userEmails: selected.map((s) => s.value) })
                  .eq("id", c.id);
                if (error) {
                  console.error(error);
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
