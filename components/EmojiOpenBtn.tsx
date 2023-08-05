"use client";
import { useContext } from "react";
import { GlobalContext } from "../app/providers"

export const EmojiOpenBtn = () => {
//   const supabase = createClientComponentClient();
    const { emojiContainerOpened, setEmojiContainerOpened } = useContext(GlobalContext);
 const onClickEmojiOpen = () => {
    if(setEmojiContainerOpened){
      setEmojiContainerOpened(!emojiContainerOpened)
      console.log(!emojiContainerOpened);
    }
  }
  return (
    <div onClick={onClickEmojiOpen}>
      이모지
    </div>
  );
};
