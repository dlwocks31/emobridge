"use client";
import { BlockNoteEditor, Editor } from "@/components/Editor";
import { EmojiContainer } from "@/components/EmojiContainer";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export function Feedbacker({
  user,
  docId,
}: {
  user: User | null;
  docId?: string;
}) {
  console.log("user", user);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const handleEditorReady = (editor: BlockNoteEditor | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  const [editable, setEditable] = useState(false);

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex justify-center">
        {editor ? <EmojiContainer editor={editor} /> : null}
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
      <div className="px-28 py-4 flex-grow flex flex-col">
        <Editor
          editable={editable}
          onEditorReady={handleEditorReady}
          userName={user?.user_metadata?.full_name}
          docId={docId}
        />
      </div>
    </div>
  );
}
