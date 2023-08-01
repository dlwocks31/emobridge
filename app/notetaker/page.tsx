import { Editor } from "@/components/Editor";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Notetaker({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="w-full">
        <div className="p-12">
          <Editor
            editable={true}
            userName={user?.user_metadata?.full_name}
            docId={searchParams?.docId as string}
          />
        </div>
      </div>
    </>
  );
}
