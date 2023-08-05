import Image from "next/image";
import { useRef, useState } from "react";

interface Emoji {
  url: string;
  def: string;
}

const emojiList: Emoji[] = [
  {
    url: "/bad.png",
    def: "별로야",
  },
  {
    url: "/fighting.png",
    def: "화이팅",
  },
  {
    url: "/funny.png",
    def: "웃겨",
  },
  {
    url: "/good.png",
    def: "재밌어",
  },
  {
    url: "/help.png",
    def: "도와줘",
  },
  {
    url: "/hungry.png",
    def: "배고파",
  },
  {
    url: "/nosleep.png",
    def: "일어나",
  },
  {
    url: "/sleep.png",
    def: "졸려",
  },
  {
    url: "/thanks.png",
    def: "고마워",
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
  const [showContainer, setShowContainer] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(null);
  const currentEmojiRef = useRef(currentEmoji);
  currentEmojiRef.current = currentEmoji;

  const handleEmojiClick = (emoji: Emoji) => {
    setCurrentEmoji(emoji.url);
    setTimeout(() => {
      if (emoji.url === currentEmojiRef.current) setCurrentEmoji(null);
    }, 2000);
    setShowContainer(false);
  };
  return (
    <div className="fixed bottom-0 right-0 m-10 flex flex-col items-end">
      {showContainer && (
        <div className="bg-gray-100 rounded-md shadow-xl m-2">
          <div>필기 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <figure>
                  <Image
                    src={emoji.url}
                    alt={emoji.def}
                    width="64"
                    height="64"
                    onClick={() => handleEmojiClick(emoji)}
                  />
                  <div className="text-center"> {emoji.def} </div>
                </figure>
              ))}
            </div>
          ))}
        </div>
      )}
      <div
        className="flex h-32 w-32 text-8xl items-center justify-center rounded-full bg-gray-100 flex-shrink-0 border border-black border-opacity-10 shadow-xl"
        onClick={() => setShowContainer(!showContainer)}
      >
        {currentEmoji && (
          <div className="h-full w-full relative">
            <Image
              src={currentEmoji}
              alt="me"
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};
