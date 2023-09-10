"use client";
import { BlockNoteEditor, Editor } from "@/components/Editor";
import { EmojiContainer } from "@/components/EmojiContainer";
import { EmojiEmoCircle } from "@/components/EmojiEmocircle";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { TitleEditor } from "../TitleEditor";

export function DocShowClient({
  user,
  id,
  name,
  userRole,
}: {
  user: User | null;
  id: string;
  name: string;
  userRole: string;
}) {
  const docId = `course-doc-${id}`;

  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const handleEditorReady = (editor: BlockNoteEditor | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  const [editable, setEditable] = useState(false);

  async function pasteImage() {
    try {
      const permission = await navigator.permissions.query({
        name: "clipboard-read",
      });
      if (permission.state === "denied") {
        throw new Error("Not allowed to read clipboard.");
      }
      console.log(permission.state);
      const clipboardContents = await navigator.clipboard.read();
      console.log(clipboardContents);
      for (const item of clipboardContents) {
        if (!item.types.includes("image/png")) {
          continue;
        }
        const blob = await item.getType("image/png");
        console.log("Blob", blob.size, blob.type);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  useEffect(() => {
    document.addEventListener("paste", pasteImage);
  }, [editor]);
  return (
    <div className="w-full flex-grow flex flex-col relative">
      <div className="w-full flex justify-end">
        {editor ? <EmojiContainer editor={editor} userRole={userRole} /> : null}
      </div>
      <div className="my-4">
        <TitleEditor initialTitle={name} id={id} />
      </div>
      <div className="flex justify-center items-center mt-2">
        <input
          type="checkbox"
          id="checkbox"
          checked={editable}
          onChange={() => setEditable(!editable)}
          className="h-5 w-5 mr-2"
        />
        <label htmlFor="checkbox">편집 활성화</label>
      </div>
      <div className="py-4 flex-grow flex flex-col">
        <Editor
          editable={editable}
          onEditorReady={handleEditorReady}
          userName={user?.user_metadata?.full_name}
          docId={docId}
        />
      </div>
      <div className="w-full flex justify-end">
        <EmojiEmoCircle docId={docId} userRole={userRole} />
      </div>
    </div>
  );
}
