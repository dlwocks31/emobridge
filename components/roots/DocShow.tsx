"use client";
import { BlockNoteEditor, Editor } from "@/components/Editor";
import { EmojiContainer } from "@/components/EmojiContainer";
import { EmojiEmoCircle } from "@/components/EmojiEmocircle";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { mockDocs } from "./CourseIndex";

export function DocShow({ user, id }: { user: User | null; id: string }) {
  const doc = mockDocs.find((d) => d.id === Number(id));

  if (!doc) {
    return <div>Doc not found</div>;
  }

  const docId = `course-doc-${doc.id}`;

  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const handleEditorReady = (editor: BlockNoteEditor | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  const [editable, setEditable] = useState(false);

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="w-full flex justify-end">
        {editor ? <EmojiContainer editor={editor} /> : null}
      </div>
      <div className="font-bold text-xl">제목: {doc.name}</div>
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
      <div>
        <EmojiEmoCircle docId={docId} />
      </div>
    </div>
  );
}
