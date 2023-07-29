
export const Emoji = ({
    emoji,
}: {
    emoji: string;
}) => {
    /* 
    width: 49.801px;
    height: 49.801px;
    flex-shrink: 0;
    border-radius: 24.9px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: #FFF;
    box-shadow: -0.6916777491569519px -2.075033187866211px 0px 0px rgba(0, 0, 0, 0.10) inset, 0px 0.6916777491569519px 2.075033187866211px 0px rgba(0, 0, 0, 0.20); */
    return <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white flex-shrink-0 border border-black border-opacity-10">
        {emoji}
    </div>
}
