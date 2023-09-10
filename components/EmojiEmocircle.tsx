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
    def: "좋아요",
  },
  {
    url: "/bad.png",
    def: "별로예요",
  },
  {
    url: "/help.png",
    def: "도와주세요",
  },
  {
    url: "/fighting.png",
    def: "화이팅",
  },
  {
    url: "/sleep.png",
    def: "졸려요",
  },
  {
    url: "/nosleep.png",
    def: "졸지마",
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
    def: "화장실\n가고 싶어",
  },
];
const RowInfo = [
  { start: 0, end: 4 },
  { start: 4, end: 8 },
  { start: 8, end: 10 },
];
export const EmojiEmoCircle = ({ docId }: { docId?: string; userRole: string }) => {
  const supabase = createClientComponentClient();
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
    <div className="fixed bottom-0 right-0 m-10 flex flex-col items-end">
      {showContainer && (
        <div
          className="rounded-3xl bg-white/30 p-4 border-black border-opacity-10 shadow-xl ring-2 ring-gray-200 bg-opacity-30 backdrop-filter backdrop-blur mb-2"
          onMouseOver={() => setShowCircle(true)}
          onMouseLeave={() => setShowCircle(false)}
        >
          <div className="text-center text-xl mb-1">감정 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <div className="flex flex-col justify-start items-center w-12 m-1">
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
          "flex h-28 w-28 text-8xl items-center justify-center rounded-full bg-gray-100 flex-shrink-0 border border-gray-300 border-opacity-10" +
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
