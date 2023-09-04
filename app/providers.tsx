"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface IGlobalContext {
  emojiContainerOpened: boolean;
  setEmojiContainerOpened: Dispatch<SetStateAction<boolean>>;
  focusedBlockId: string | null;
  setFocusedBlockId: Dispatch<SetStateAction<string | null>>;
}

export const GlobalContext = createContext<IGlobalContext>({
  emojiContainerOpened: false,
  setEmojiContainerOpened: () => {},
  focusedBlockId: null,
  setFocusedBlockId: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [emojiContainerOpened, setEmojiContainerOpened] = useState(true);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const value = {
    emojiContainerOpened,
    setEmojiContainerOpened,
    focusedBlockId,
    setFocusedBlockId,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
