"use client";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../app/providers";
import { usePathname, useRouter } from 'next/navigation';

export const EmoEmojiOpenBtn = () => {
  //   const supabase = createClientComponentClient();
  const [showButton, setShowButton] = useState(false)
  const pathname = usePathname();
  const router = useRouter();
  const { emoEmojiContainerOpened, setEmoEmojiContainerOpened } =
    useContext(GlobalContext);
  
  useEffect(() => {
    const isTargetPage =
      /^\/editor\/doc\/\d+$/.test(pathname) || /^\/feedbacker\/doc\/\d+$/.test(pathname);
    setShowButton(isTargetPage);
  }, [pathname]);

  if (!showButton) return null;

  const onClickEmojiOpen = () => {
    if (setEmoEmojiContainerOpened) {
      setEmoEmojiContainerOpened(!emoEmojiContainerOpened);
      console.log(!emoEmojiContainerOpened);
    }
  };
  return (
    <div onClick={onClickEmojiOpen}>
      <img src={emoEmojiContainerOpened ? "/smileLight.png" : "/smile.png"} alt="소통이모지 버튼" width="24" height="24"></img>
    </div>
  );
};
