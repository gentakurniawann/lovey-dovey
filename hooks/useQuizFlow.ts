import { useCallback } from "react";
import { QuizState, QuizQuestion } from "@/types/chat";
import { QUIZ_INIT_STATE } from "@/constants/chatConst";
import { calculateResult, getRandomReaction, delay } from "@/utils/randomQuest";

export const useQuizFlow = (
  state: QuizState,
  updateState: (updates: Partial<QuizState>) => void,
  addBotMessages: (
    messages: string[],
    existing?: any[],
    withDelay?: boolean
  ) => Promise<void>,
  addReaction: (reaction: any) => Promise<void>,
  addMessage: (message: string, type: "bot" | "user", reaction?: any) => any,
  saveExpectedMessages: (
    messages: string[],
    phase: string,
    context: any
  ) => void,
  clearExpectedMessages: (phase: string) => void,
  loadMessages: () => any[],
  showResults: (score: number) => Promise<void>,
  randomizedQuestions: QuizQuestion[], // Add this parameter
  initializeRandomizedQuestions: () => QuizQuestion[] // Add this parameter
) => {
  const presentQuestion = useCallback(
    async (questionIndex: number) => {
      // Ensure we have randomized questions
      if (randomizedQuestions.length === 0) {
        console.warn("No randomized questions available");
        return;
      }

      const question = randomizedQuestions[questionIndex];
      if (!question) {
        console.warn(`No question found at index ${questionIndex}`);
        return;
      }

      const allMessages = [question.question];
      saveExpectedMessages(allMessages, `question_${questionIndex}`, {
        questionIndex,
      });

      const currentMessages = loadMessages();
      await addBotMessages(allMessages, currentMessages);
      clearExpectedMessages(`question_${questionIndex}`);
    },
    [
      addBotMessages,
      saveExpectedMessages,
      clearExpectedMessages,
      loadMessages,
      randomizedQuestions,
    ]
  );

  const startQuiz = useCallback(async () => {
    // Ensure we have randomized questions before starting
    let questions = randomizedQuestions;
    if (questions.length === 0) {
      questions = initializeRandomizedQuestions();
    }

    // Double-check we have questions
    if (questions.length === 0) {
      console.error("Failed to initialize randomized questions");
      return;
    }

    updateState({ phase: "questions", phaseProgress: "in_progress" });
    await presentQuestion(state.currentQuestion || 0);
  }, [
    updateState,
    state.currentQuestion,
    presentQuestion,
    randomizedQuestions,
    initializeRandomizedQuestions,
  ]);

  const handleOptionSelect = useCallback(
    async (option: { text: string; value: number }) => {
      addMessage(option.text, "user");

      const newAnswers = [...state.answers, option.value];
      const newScore = state.totalScore + option.value;
      const nextQuestion = state.currentQuestion + 1;

      updateState({
        answers: newAnswers,
        totalScore: newScore,
        currentQuestion: nextQuestion,
      });

      await delay(500);
      const reaction = getRandomReaction(option.value);
      await addReaction(reaction);
      await delay(2000);

      const isLastQuestion = nextQuestion >= QUIZ_INIT_STATE.totalQuestions;
      if (!isLastQuestion) {
        await delay(500);
        await presentQuestion(nextQuestion);
      } else {
        updateState({ phaseProgress: "complete" });
        await showResults(newScore);
      }
    },
    [state, updateState, addMessage, addReaction, presentQuestion, showResults]
  );

  return {
    presentQuestion,
    startQuiz,
    handleOptionSelect,
  };
};
