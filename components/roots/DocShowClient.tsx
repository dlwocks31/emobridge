"use client";
import { BlockNoteEditor, Editor } from "@/components/Editor";
import { EmojiContainer } from "@/components/EmojiContainer";
import { EmojiEmoCircle } from "@/components/EmojiEmocircle";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Database } from "../../database.types";
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

  const supabase = createClientComponentClient<Database>();

  const handleEditorReady = (editor: BlockNoteEditor | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  const [editable, setEditable] = useState(true);

  async function pasteImage(e: ClipboardEvent) {
    console.log("pasteImage running");
    const editorElement = document.querySelector(".ProseMirror");

    const inEditor =
      (editorElement && editorElement.contains(e.target as Node)) ||
      (e.target as HTMLElement)?.nodeName === "BR"; // for some unknown reason, pasting at start of line is not detected as being inside editorElement. This is a workaround
    if (!inEditor) {
      console.log("pasteImage: not in editor. target is", e.target);
      return;
    }
    const clipboardData = e.clipboardData;
    if (!clipboardData || !clipboardData.files.length) {
      console.log("no clipboard data");
      return;
    }
    const file = clipboardData.files[0];
    console.log("file", file);
    const supportedFormats = ["image/png", "image/jpeg", "image/gif"];
    if (!supportedFormats.includes(file.type)) {
      console.log("not supported format");
      return;
    }

    const fileExtension = file.type.split("/")[1];
    const fileName = `${docId}/${nanoid()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from("editorFiles")
      .upload(fileName, file);

    if (error) {
      console.log("Error uploading image", error);
      return;
    }

    console.log("supabase upload data", data);

    const { data: publicUrlData } = await supabase.storage
      .from("editorFiles")
      .getPublicUrl(fileName);

    editor?.insertBlocks(
      [
        {
          type: "image",
          props: {
            src: publicUrlData.publicUrl,
            alt: `File: ${file.name}`,
          },
        },
      ],
      editor.getTextCursorPosition().block.id,
    );
  }
  useEffect(() => {
    document.addEventListener("paste", pasteImage);

    return () => {
      document.removeEventListener("paste", pasteImage);
    };
  }, [editor]);
  return (
    <div className="w-full flex-grow flex flex-col">
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
      <div className="w-full flex justify-end relative">
        <EmojiEmoCircle docId={docId} userRole={userRole} />
      </div>
    </div>
  );
}
