"use client";
import { Editor } from "@/components/Editor";

export default function Notetaker() {
  return (
    <>
      <div className="w-full">
        <div className="p-12">
          <Editor editable={true} />
        </div>
      </div>
    </>
  );
}
