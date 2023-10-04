"use client";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../app/providers";
import { usePathname, useRouter } from 'next/navigation';

export const EmojiOpenBtn = () => {
  //   const supabase = createClientComponentClient();
  const [showButton, setShowButton] = useState(false)
  const pathname = usePathname();
  const router = useRouter();
  const { emojiContainerOpened, setEmojiContainerOpened } =
    useContext(GlobalContext);
  
  useEffect(() => {
    const isTargetPage =
      /^\/editor\/doc\/\d+$/.test(pathname) || /^\/feedbacker\/doc\/\d+$/.test(pathname);
    setShowButton(isTargetPage);
  }, [pathname]);

  if (!showButton) return null;

  const onClickEmojiOpen = () => {
    if (setEmojiContainerOpened) {
      setEmojiContainerOpened(!emojiContainerOpened);
      console.log(!emojiContainerOpened);
    }
  };
  return (
    <div onClick={onClickEmojiOpen}>
      <img src={emojiContainerOpened ? "/writeLight.png" : "/write.png"} alt="필기이모지 버튼" width="24" height="24"></img>
    </div>
  );
};
