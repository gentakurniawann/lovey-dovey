import { QuizQuestion } from "@/types/quiz";

export const getRandomQuestions = (
  questions: QuizQuestion[],
  count: number = 8
): QuizQuestion[] => {
  const shuffledQuestions = [...questions]
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map((question) => ({
      ...question,
      options: [...question.options].sort(() => 0.5 - Math.random()), // shuffle options
    }));

  return shuffledQuestions;
};
