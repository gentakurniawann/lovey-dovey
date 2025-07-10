import { QUIZ_DATA } from "@/constants/chatConst";
import { QuizReaction } from "@/types/chat";
import { QuizQuestion } from "@/types/chat";

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

// Add this to your @/utils/randomQuest.ts file or create a new utils file
/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Randomize questions and their options while preserving option values
 */
export const randomizeQuizData = (
  questions: QuizQuestion[]
): QuizQuestion[] => {
  // First, shuffle the questions array
  const shuffledQuestions = shuffleArray(questions);

  // Then, shuffle the options within each question
  return shuffledQuestions.map((question) => ({
    ...question,
    options: shuffleArray(question.options),
  }));
};

/**
 * Initialize randomized quiz data - call this once at the start of the quiz
 */
export const initializeRandomizedQuiz = (
  originalQuestions: QuizQuestion[]
): QuizQuestion[] => {
  // Check if we already have randomized data in session storage
  const sessionKey = "randomized_quiz_data";
  const existingData = sessionStorage.getItem(sessionKey);

  if (existingData) {
    try {
      return JSON.parse(existingData);
    } catch (error) {
      console.warn("Failed to parse existing randomized quiz data:", error);
    }
  }

  // Generate new randomized data
  const randomizedQuestions = randomizeQuizData(originalQuestions);

  // Store in session storage to maintain consistency during the quiz session
  sessionStorage.setItem(sessionKey, JSON.stringify(randomizedQuestions));

  return randomizedQuestions;
};

/**
 * Clear randomized quiz data (call when starting a new quiz)
 */
export const clearRandomizedQuizData = (): void => {
  sessionStorage.removeItem("randomized_quiz_data");
};
