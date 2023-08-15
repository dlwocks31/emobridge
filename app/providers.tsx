"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface IGlobalContext {
  emojiContainerOpened: boolean;
  setEmojiContainerOpened: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<IGlobalContext>({
  emojiContainerOpened: false,
  setEmojiContainerOpened: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [emojiContainerOpened, setEmojiContainerOpened] = useState(true);
  const value = {
    emojiContainerOpened,
    setEmojiContainerOpened,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
