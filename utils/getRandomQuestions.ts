import { QuizQuestion } from "@/types/chat";

export const getRandomQuestions = (
  questions: QuizQuestion[],
  count: number = 8
): QuizQuestion[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
