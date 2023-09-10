"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Database } from "../database.types";

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
  };
  return (
    <div className="flex items-center">
      <input
        type="text"
        value={title}
        className="input text-2xl font-bold"
        onChange={(e) => setTitle(e.target.value)}
      />
      {title !== lastSavedTitle ? (
        <>
          <button className="btn ml-2 btn-success" onClick={onSave}>
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "저장"
            )}
          </button>
          <button
            className="btn ml-2 btn-error"
            onClick={() => setTitle(lastSavedTitle)}
          >
            취소
          </button>
        </>
      ) : null}
    </div>
  );
}
