"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../database.types";
import { cn } from "../utils/cn";

export function DocDelete({ documentId }: { documentId: number }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const deleteDocument = async () => {
    const { error } = await supabase
      .from("documents")
      .update({ isHidden: true })
      .eq("id", documentId);

    if (error) {
      alert(error.message);
    }
    router.refresh();
  };

  return (
    <div className="px-4" onClick={deleteDocument}>
      🗑️
    </div>
  );
}
