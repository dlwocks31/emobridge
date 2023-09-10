import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Emoji {
  url: string;
  def: string;
}

const emojiListF: Emoji[] = [
  {
    url: "/thanksF.png",
    def: "고마워요",
  },
  {
    url: "/goodF.png",
    def: "좋아요",
  },
  {
    url: "/funnyF.png",
    def: "웃겨요",
  },
  {
    url: "/concentrateF.png",
    def: "여기 집중\n해주세요",
  },
  {
    url: "/restF.png",
    def: "잠시\n쉬어가요",
  },
  {
    url: "/fightingF.png",
    def: "화이팅",
  },
  {
    url: "/nosleepF.png",
    def: "졸지마요",
  },
  {
    url: "/helpF.png",
    def: "도와주세요",
  },
  {
    url: "/toiletF.png",
    def: "화장실\n가고 싶어요",
  },
];
const emojiListE: Emoji[] = [
  {
    url: "/thanksE.png",
    def: "고마워요",
  },
  {
    url: "/goodE.png",
    def: "좋아요",
  },
  {
    url: "/funnyE.png",
    def: "웃겨요",
  },
  {
    url: "/concentrateE.png",
    def: "여기 집중\n해주세요",
  },
  {
    url: "/restE.png",
    def: "잠시\n쉬어가요",
  },
  {
    url: "/fightingE.png",
    def: "화이팅",
  },
  {
    url: "/nosleepE.png",
    def: "졸지마요",
  },
  {
    url: "/helpE.png",
    def: "도와주세요",
  },
  {
    url: "/toiletE.png",
    def: "화장실\n가고 싶어요",
  },
];
const RowInfo = [
  { start: 0, end: 3 },
  { start: 3, end: 6 },
  { start: 6, end: 9 },
];
export const EmojiEmoCircle = ({ docId, userRole }: { docId?: string; userRole: string }) => {
  const supabase = createClientComponentClient();
  const emojiList = userRole === "feedbacker" ? emojiListF : emojiListE;
  const backgroundColor = userRole === "feedbacker" ? "bg-yellow-300" : "bg-white/30";
  const circleColor = userRole === "feedbacker" ? "bg-yellow-300" : "bg-gray-300";

  const [channel] = useState(() =>
    supabase.channel(docId ? `emotion-emoji-${docId}` : "emotion-emoji", {
      config: {
        broadcast: {
          self: false,
        },
      },
    }),
  );
  const [showContainer, setShowContainer] = useState(false);
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
    }, 2000);
    setShowContainer(false);
    if (option.isLocal) {
      channel.send({
        type: "broadcast",
        event: "click",
        payload: { emoji },
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
    <div className="absolute bottom-0 right-0 mb-10 flex flex-col items-end">
      {showContainer && (
        <div
          className={`h-100 rounded-3xl ${backgroundColor} p-4 border-black border-opacity-10 shadow-xl ring-2 ring-gray-200 bg-opacity-30 backdrop-filter backdrop-blur mb-2`}
          onMouseOver={() => setShowCircle(true)}
          onMouseLeave={() => setShowCircle(false)}
        >
          <div className="text-center text-xl mb-1">감정 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <div className="flex flex-col justify-start items-center w-16 m-1">
                  <Image
                    src={emoji.url}
                    alt={emoji.def}
                    width="50"
                    height="50"
                    onClick={() => handleEmojiClick(emoji, { isLocal: true })}
                  />
                  <div className="text-xs w-16 font-normal text-center whitespace-pre-wrap ter mt-1">
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
          `flex h-28 w-28 text-8xl items-center justify-center rounded-full ${circleColor} flex-shrink-0 border border-gray-300 border-opacity-10` +
          (showCircle
            ? " ring-2 ring-gray-200 shadow-xl"
            : " transition-opacity duration-200 bg-opacity-50 border-opacity-20")
        }
        onClick={() => {
          setShowContainer(!showContainer), setShowCircle(true);
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
