"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../database.types";
import { cn } from "../utils/cn";

export function DocCreate({ courseId }: { courseId: number }) {
  const supabase = createClientComponentClient<Database>();
  const [docName, setDocName] = useState("");
  const router = useRouter();
  const createDocument = async () => {
    if (!docName) return;
    const { error } = await supabase
      .from("documents")
      .insert({ name: docName, courseId });

    if (error) {
      alert(error.message);
    }
    setDocName("");
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="문서 이름"
        className="input input-bordered"
        value={docName}
        onChange={(e) => setDocName(e.target.value)}
      />
      <div
        className={cn("btn", {
          "btn-disabled": !docName,
        })}
        onClick={createDocument}
      >
        문서 생성
      </div>
    </div>
  );
}
