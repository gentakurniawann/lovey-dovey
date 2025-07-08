import { QUIZ_DATA } from "@/constants/chatConst";
import { QuizReaction } from "@/types/chat";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const calculateResult = (score: number, totalQuestions: number) => {
  const percentage = (score / (totalQuestions * 4)) * 100;
  if (percentage >= 75) return "high";
  if (percentage >= 50) return "medium";
  return "low";
};

export const getRandomReaction = (answerValue: number): QuizReaction => {
  const reactions = QUIZ_DATA.questionReactions[answerValue];
  return reactions[Math.floor(Math.random() * reactions.length)];
};
