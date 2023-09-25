"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Database } from "../database.types";
import { cn } from "../utils/cn";
import { setSyntheticLeadingComments } from "typescript";

export function DocDelete({ documentId }: { documentId: number }) {
  const supabase = createClientComponentClient<Database>();
  const [checkBtn, setCheckBtn] = useState("trashcan");
  const handleOnClick = (img: typeof checkBtn) => {
    if (img === "trashcan") {
      setCheckBtn("checkandcross");
    } else if (img === "check") {
      deleteDocument();
    } else if (img === "cross") {
      setCheckBtn("trashcan");
    }
  };
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
    <div>
      {checkBtn === "trashcan" && (
        <div className={"btn btn-ghost px-1 w-10"}>
          <img
            src={"/trashcanNew.png"}
            alt="trashcan"
            onClick={() => handleOnClick("trashcan")}
            width="36"
            height="24"
          />
        </div>
      )}
      {checkBtn === "checkandcross" && (
        <div className={"flex justify-between items-center"}>
          <div className={"btn btn-ghost px-1 w-10"}>
            <img
              src={"/checkNew.png"}
              alt="check"
              onClick={() => handleOnClick("check")}
              width="36"
              height="24"
            />
          </div>
          <div className={"btn btn-ghost px-1 w-10"}>
            <img
              src={"/crossNew.png"}
              alt="cross"
              onClick={() => handleOnClick("cross")}
              width="36"
              height="24"
            />
          </div>
        </div>
      )}
    </div>
  );
}
