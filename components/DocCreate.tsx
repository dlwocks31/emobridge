"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../database.types";

export function DocCreate({ courseId }: { courseId: number }) {
  const supabase = createClientComponentClient<Database>();
  const [docName, setDocName] = useState("");
  const router = useRouter();
  const createDocument = async () => {
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
      <div className="btn" onClick={createDocument}>
        문서 생성
      </div>
    </div>
  );
}
