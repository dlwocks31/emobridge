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

  const [editable, setEditable] = useState(false);

  async function pasteImage(e: ClipboardEvent) {
    // TODO: check if the paste event is in the editor.
    // Below does not work, not sure why...
    // const editorElement = document.querySelector(".ProseMirror");
    // if (!editorElement || !editorElement.contains(e.target as Node)) {
    //   console.log("pasteImage: not in editor");
    //   return;
    // }

    try {
      const clipboardContents = await navigator.clipboard.read();
      for (const item of clipboardContents) {
        if (!item.types.includes("image/png")) {
          continue;
        }
        const blob = await item.getType("image/png");
        console.log("Blob", blob.size, blob.type);
        const fileName = `${nanoid()}.png`;

        const { data, error } = await supabase.storage
          .from("editorFiles")
          .upload(fileName, blob);
        if (error) {
          console.log("Error uploading image", error);
          continue;
        }
        console.log("Uploaded image", data);
        const { data: publicUrlData } = await supabase.storage
          .from("editorFiles")
          .getPublicUrl(fileName);
        editor?.insertBlocks(
          [
            {
              type: "image",
              props: {
                src: publicUrlData.publicUrl,
                alt: "Image",
              },
            },
          ],
          editor.getTextCursorPosition().block.id,
        );
      }
    } catch (error) {
      alert(`Failed to read clipboard contents: ${error}`);
    }
  }
  useEffect(() => {
    document.addEventListener("paste", pasteImage);

    return () => {
      document.removeEventListener("paste", pasteImage);
    };
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
