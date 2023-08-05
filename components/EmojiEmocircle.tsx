import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Emoji {
  url: string;
  def: string;
}

const emojiList: Emoji[] = [
  {
    url: "/good.png",
    def: "좋아",
  },
  {
    url: "/bad.png",
    def: "별로야",
  },
  {
    url: "/help.png",
    def: "도와줘",
  },
  {
    url: "/fighting.png",
    def: "화이팅",
  },
  {
    url: "/sleep.png",
    def: "졸려",
  },
  {
    url: "/nosleep.png",
    def: "일어나",
  },
  {
    url: "/thanks.png",
    def: "고마워",
  },
  {
    url: "/funny.png",
    def: "웃겨",
  },
  {
    url: "/hungry.png",
    def: "배고파",
  },
  {
    url: "/toilet.png",
    def: "화장실",
  },
];
const RowInfo = [
  { start: 0, end: 4 },
  { start: 4, end: 8 },
  { start: 8, end: 10 },
];
export const EmojiEmoCircle = () => {
  const supabase = createClientComponentClient();
  const [channel] = useState(() =>
    supabase.channel("emotion-emoji", {
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
  }, []);
  return (
    <div className="fixed bottom-0 right-0 m-10 flex flex-col items-end">
      {showContainer && (
        <div
          className="bg-gray-100 rounded-lg shadow-xl m-2 ring-2 ring-gray-200"
          onMouseOver={() => setShowCircle(true)}
          onMouseLeave={() => setShowCircle(false)}
        >
          <div className="text-center text-xl">필기 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <figure>
                  <Image
                    src={emoji.url}
                    alt={emoji.def}
                    width="64"
                    height="64"
                    onClick={() => handleEmojiClick(emoji, { isLocal: true })}
                  />
                  <div className="text-center text-base font-normal">
                    {" "}
                    {emoji.def}{" "}
                  </div>
                </figure>
              ))}
            </div>
          ))}
        </div>
      )}
      <div
        className={
          "flex h-32 w-32 text-8xl items-center justify-center rounded-full bg-gray-100 flex-shrink-0 border border-gray-300 border-opacity-10" +
          (showCircle
            ? " ring-2 ring-gray-200 shadow-xl"
            : " transition-opacity duration-200 bg-opacity-40 border-opacity-20")
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
