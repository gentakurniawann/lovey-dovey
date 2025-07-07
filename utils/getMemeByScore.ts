import { ReactionDataset } from "@/types/quiz";

export const getMemeByScore = (
  score: number,
  reactions: ReactionDataset
): string => {
  const tier = Math.min(Math.floor(score / 8), 3); // adjust depending on max score
  const options = reactions[tier] || reactions["default"];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};
