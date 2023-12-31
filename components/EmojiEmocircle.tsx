import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../app/providers";
import {
  Emoji,
  emotionEditorEmojis,
  emotionFeedbackerEmojis,
} from "../utils/emojis";
import { insertLog } from "../utils/logs";

const RowInfo = [
  { start: 0, end: 3 },
  { start: 3, end: 6 },
  { start: 6, end: 9 },
];
export const EmojiEmoCircle = ({
  docCollabKey,
  userRole,
  documentId,
}: {
  docCollabKey: string;
  userRole: string;
  documentId: number;
}) => {
  const supabase = createClientComponentClient();
  const { emoEmojiContainerOpened, setEmoEmojiContainerOpened } =
    useContext(GlobalContext);
  const emojiList =
    userRole === "feedbacker" ? emotionFeedbackerEmojis : emotionEditorEmojis;
  const backgroundColor =
    userRole === "feedbacker" ? "bg-yellow-300" : "bg-white/30";
  const circleColor =
    userRole === "feedbacker" ? "bg-yellow-300" : "bg-gray-300";

  const [channel] = useState(() =>
    supabase.channel(`emotion-emoji-${docCollabKey}`, {
      config: {
        broadcast: {
          self: false,
        },
      },
    }),
  );
  //const [showContainer, setShowContainer] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(null);
  const [currentEmojiAlt, setCurrentEmojiAlt] = useState<string>("");
  const [isEmojiVisible, setIsEmojiVisible] = useState(false);
  const currentEmojiRef = useRef(currentEmoji);
  const currentEmojiAltRef = useRef(currentEmojiAlt);
  currentEmojiRef.current = currentEmoji;
  currentEmojiAltRef.current = currentEmojiAlt;
  const [showCircle, setShowCircle] = useState(false);

  const handleEmojiClick = (emoji: Emoji, option: { isLocal: boolean }) => {
    console.log("handleEmojiClick running:", emoji);
    setCurrentEmoji(emoji.url);
    setCurrentEmojiAlt(emoji.def);
    setIsEmojiVisible(true);
    setTimeout(() => {
      if (emoji.url === currentEmojiRef.current) {
        setIsEmojiVisible(false);
        setShowCircle(false);
      }
    }, 5000);
    setEmoEmojiContainerOpened(false);
    console.log("in handleEmojiClick:", option);
    if (option.isLocal) {
      channel.send({
        type: "broadcast",
        event: "click",
        payload: { emoji },
      });
      insertLog({
        logType: "addEmoji",
        documentId,
        emojiType: emoji.url,
      });
    }
  };

  useEffect(() => {
    channel
      .on("broadcast", { event: "click" }, (payload) => {
        console.log("received broadcast:", payload);
        handleEmojiClick(payload.payload.emoji, { isLocal: false });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  return (
    <div className="fixed bottom-0 right-0 mb-10 mr-10 flex flex-col items-end">
      {emoEmojiContainerOpened && (
        <div
          className={`h-100 rounded-3xl ${backgroundColor} p-2 border-black border-opacity-10 shadow-xl ring-2 ring-gray-200 bg-opacity-30 backdrop-filter backdrop-blur mb-3`}
          onMouseOver={() => setShowCircle(true)}
          onMouseLeave={() => setShowCircle(false)}
        >
          <div className="text-center text-lg font-bold mb-1 m-1">
            소통 이모지
          </div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <div className="flex flex-col justify-start items-center w-14 m-1">
                  <Image
                    src={emoji.url}
                    alt={emoji.def}
                    width="44"
                    height="44"
                    onClick={() => handleEmojiClick(emoji, { isLocal: true })}
                  />
                  <div className="text-xs w-16 text-center whitespace-pre-wrap mt-1">
                    {emoji.def}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div
        className={
          `flex h-40 w-40 text-8xl items-center justify-center rounded-full ${circleColor} flex-shrink-0 border border-gray-300 border-opacity-10` +
          (showCircle
            ? " ring-2 ring-gray-200 shadow-xl"
            : " transition-opacity duration-200 bg-opacity-50 border-opacity-20")
        }
        onClick={() => {
          setEmoEmojiContainerOpened(!emoEmojiContainerOpened),
            setShowCircle(true);
        }}
        onMouseOver={() => setShowCircle(true)}
        onMouseLeave={() => setShowCircle(false)}
      >
        {currentEmoji && (
          <div
            className={`h-full w-full relative transition-opacity ${
              isEmojiVisible ? "opacity-100" : "opacity-0 duration-200"
            }`}
          >
            <Image
              key={currentEmoji}
              src={currentEmoji}
              alt={currentEmojiAlt}
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};
