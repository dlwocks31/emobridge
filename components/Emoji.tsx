import Image from "next/image";

export const Emoji = ({ emoji }: { emoji: string }) => {
  // className="flex h-8 w-8 items-center justify-center rounded-full bg-white flex-shrink-0 border border-black border-opacity-10 shadow"
  return (
    <div>
      <Image src={emoji} alt="me" width="35" height="35" />
    </div>
  );
};
