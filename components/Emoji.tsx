
export const Emoji = ({
    emoji,
}: {
    emoji: string;
}) => {
    return <div className="absolute -left-24 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
        {emoji}
    </div>
}
