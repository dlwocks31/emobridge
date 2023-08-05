import { Emoji } from "./Emoji";
import Image from "next/image";
import { useState } from "react";

const emojiList = [
  {
    url: "/bad.png",
  },
  {
    url: "/fighting.png",
  },
  {
    url: "/funny.png",
  },
  {
    url: "/good.png",
  },
  {
    url: "/help.png",
  },
  {
    url: "/hungry.png",
  },
  {
    url: "/nosleep.png",
  },
  {
    url: "/sleep.png",
  },
  {
    url: "/thanks.png",
  },
  {
    url: "/toilet.png",
  },
];
const RowInfo = [
  { start: 0, end: 3 },
  { start: 3, end: 6 },
  { start: 6, end: 9 },
  { start: 9, end: 10 },
];
export const EmojiEmoCircle = () => {
  const [showContainer, setShowContainer] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(null);

  return (
    <div className="fixed bottom-0 right-0 m-10 flex flex-col items-end">
      {showContainer && (
        <div className="bg-gray-100 rounded-md shadow-xl m-2">
          <div>필기 이모지</div>
          {RowInfo.map((row, index) => (
            <div className="flex">
              {emojiList.slice(row.start, row.end).map((emoji, index) => (
                <Image
                  src={emoji.url}
                  alt="me"
                  width="64"
                  height="64"
                  onClick={() => setCurrentEmoji(emoji.url)}
                />
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
