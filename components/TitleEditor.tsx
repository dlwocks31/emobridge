"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const router = useRouter();

  const saveTitle = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("documents")
      .update({ name: title })
      .eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    setLastSavedTitle(title);
    router.refresh();
    setIsLoading(false);
  };

  const debouncedSaveTitle = debounce(saveTitle, 1000);

  useEffect(() => {
    if (title !== lastSavedTitle) {
      debouncedSaveTitle();
    }
    return () => debouncedSaveTitle.cancel();
  }, [title]);

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={title}
        className="input text-2xl font-bold -ml-4"
        onChange={(e) => setTitle(e.target.value)}
      />
      {isLoading && (
        <span className="loading loading-spinner loading-md ml-4"></span>
      )}
    </div>
  );
}
