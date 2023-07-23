"use client";
import Editor from "@/components/Editor";
export const dynamic = "force-dynamic";
const emojis = ["👍", "🤔", "🌟"]; // Your emoji list

export default function Index() {
  return (
    <>
      <div className="w-full">
        <div className="p-12">
          <Editor />
        </div>
      </div>
    </>
  );
}
