
export const Emoji = ({
    emoji,
}: {
    emoji: string;
}) => {
    return <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
        {emoji}
    </div>
}
