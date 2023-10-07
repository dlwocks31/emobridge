export interface Emoji {
  url: string;
  def: string;
}

export const emotionFeedbackerEmojis: Emoji[] = [
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
export const emotionEditorEmojis: Emoji[] = [
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

export const notetakingFeedbackerEmojis = [
  {
    url: "/importantF.png",
    def: "중요해요",
  },
  {
    url: "/moreF.png",
    def: "더 자세하게\n써주세요",
  },
  {
    url: "/enoughF.png",
    def: "충분해요",
  },
  {
    url: "/pptF.png",
    def: "PPT대로\n써주세요",
  },
  {
    url: "/photoF.png",
    def: "사진찍어서\n넣어주세요",
  },
  {
    url: "/fixF.png",
    def: "고쳐주세요",
  },
  {
    url: "/hardF.png",
    def: "어려워요",
  },
  {
    url: "/curiousF.png",
    def: "제가 맞게\n썼나요?",
  },
  {
    url: "/emptyF.png",
    def: "잠깐 자리\n비울게요",
  },
];
export const notetakingEditorEmojis = [
  {
    url: "/importantE.png",
    def: "중요해요",
  },
  {
    url: "/moreE.png",
    def: "더 자세하게\n써주세요",
  },
  {
    url: "/enoughE.png",
    def: "충분해요",
  },
  {
    url: "/pptE.png",
    def: "PPT대로\n써주세요",
  },
  {
    url: "/photoE.png",
    def: "사진찍어서\n넣어주세요",
  },
  {
    url: "/fixE.png",
    def: "고쳐주세요",
  },
  {
    url: "/hardE.png",
    def: "어려워요",
  },
  {
    url: "/curiousE.png",
    def: "제가 맞게\n썼나요?",
  },
  {
    url: "/emptyE.png",
    def: "잠깐 자리\n비울게요",
  },
];
export function getEmojiClass(emojiUrl: string) {
  return emotionFeedbackerEmojis.some((a) => a.url === emojiUrl) ||
    emotionEditorEmojis.some((a) => a.url === emojiUrl)
    ? ("emotion" as const)
    : ("notetaking" as const);
}
