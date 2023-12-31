"use client";
import { BlockNoteEditor, Editor } from "@/components/Editor";
import { EmojiContainer } from "@/components/EmojiContainer";
import { EmojiEmoCircle } from "@/components/EmojiEmocircle";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Database } from "../../database.types";
import { backup } from "../../utils/backup";
import { DirectoryNavigation } from "../DirectoryNavigation";
import { TitleEditor } from "../TitleEditor";
export function DocShowClient({
  user,
  id,
  name,
  userRole,
  course,
}: {
  user: User | null;
  id: string;
  name: string;
  userRole: string;
  course: {
    id: number;
    name: string;
  };
}) {
  const docCollabKey = `course-doc-${id}`;

  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  const supabase = createClientComponentClient<Database>();

  const handleEditorReady = (editor: BlockNoteEditor | null) => {
    console.log("handleEditorReady");
    setEditor(editor);
  };

  const [lastBackup, setLastBackup] = useState<dayjs.Dayjs | null>(null);
  const [hasBackupError, setHasBackupError] = useState(false);

  const backupWithState = async (editor: BlockNoteEditor) => {
    console.log("backupWithState Start");
    const { error, data } = await backup(editor, +id);
    console.log("backup returned, data", data);
    if (data) {
      const parsedDate = dayjs(data.createdAt); // Parsing the datetime string to a Day.js object
      setLastBackup(parsedDate); // Now it's a Day.js object, compatible with the state type
      console.log("backupWithState: backup success");
      setHasBackupError(false);
    } else {
      console.error(error);
      setHasBackupError(true);
    }
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
    const fileName = `${docCollabKey}/${nanoid()}.${fileExtension}`;

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
      <div className="w-full flex">
        {editor ? (
          <EmojiContainer
            editor={editor}
            userRole={userRole}
            documentId={+id}
          />
        ) : null}
      </div>
      <div>
        <DirectoryNavigation
          directories={[
            { name: "나의 수업", href: `/${userRole}/course` },
            { name: course.name, href: `/${userRole}/course/${course.id}` },
            { name },
          ]}
        />
      </div>

      <div className="my-2 flex gap-2 items-center">
        <TitleEditor initialTitle={name} id={id} />
        {hasBackupError && (
          <div className="text-red-500 text-sm">저장에 실패했습니다.</div>
        )}
        {lastBackup && (
          <div className="text-gray-400 text-sm">
            {lastBackup?.format("HH:mm:ss")}에 저장됨
          </div>
        )}
      </div>
      <div className="py-4 px-56 flex-grow flex flex-col">
        <Editor
          editable={editable}
          onEditorReady={handleEditorReady}
          userName={user?.user_metadata?.full_name}
          docCollabKey={docCollabKey}
          documentId={+id}
          editorBackupFn={backupWithState}
        />
      </div>
      <div className="w-full flex justify-end relative">
        <EmojiEmoCircle
          docCollabKey={docCollabKey}
          userRole={userRole}
          documentId={+id}
        />
      </div>
    </div>
  );
}
