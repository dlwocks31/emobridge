"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../database.types";
import { cn } from "../utils/cn";

export function TitleEditor({
  initialTitle,
  id,
}: {
  initialTitle: string;
  id: string;
}) {
  const supabase = createClientComponentClient<Database>();
  const [title, setTitle] = useState(initialTitle);
  const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSave = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { error } = await supabase
      .from("documents")
      .update({ name: title })
      .eq("id", id);
    setIsLoading(false);
    if (error) {
      console.error(error);
      return;
    }
    setLastSavedTitle(title);

    router.refresh();
  };

  const hasChange = title !== lastSavedTitle;
  return (
    <div className="flex items-center">
      <input
        type="text"
        value={title}
        className="input text-2xl font-bold"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className={cn("btn ml-2", {
          "btn-success": hasChange,
          "btn-disabled": !hasChange,
        })}
        onClick={onSave}
      >
        {isLoading ? <span className="loading loading-spinner"></span> : "저장"}
      </button>

      {hasChange && (
        <button
          className="btn ml-2 btn-error"
          onClick={() => setTitle(lastSavedTitle)}
        >
          취소
        </button>
      )}
    </div>
  );
}
