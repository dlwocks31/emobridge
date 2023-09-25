"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { BlockNoteEditor } from "../components/Editor";

interface IGlobalContext {
  emojiContainerOpened: boolean;
  setEmojiContainerOpened: Dispatch<SetStateAction<boolean>>;
  focusedBlockId: string | null;
  setFocusedBlockId: Dispatch<SetStateAction<string | null>>;
  editor: BlockNoteEditor | null;
  setEditor: Dispatch<SetStateAction<BlockNoteEditor | null>>;
  emoEmojiContainerOpened: boolean;
  setEmoEmojiContainerOpened: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<IGlobalContext>({
  emojiContainerOpened: false,
  setEmojiContainerOpened: () => {},
  focusedBlockId: null,
  setFocusedBlockId: () => {},
  editor: null,
  setEditor: () => {},
  emoEmojiContainerOpened: false,
  setEmoEmojiContainerOpened: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [emojiContainerOpened, setEmojiContainerOpened] = useState(true);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
  const [emoEmojiContainerOpened, setEmoEmojiContainerOpened] = useState(true);
  const value = {
    emojiContainerOpened,
    setEmojiContainerOpened,
    focusedBlockId,
    setFocusedBlockId,
    editor,
    setEditor,
    emoEmojiContainerOpened,
    setEmoEmojiContainerOpened,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
