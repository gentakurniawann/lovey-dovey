// Update your useQuizState hook to include randomized questions

import { useState, useCallback } from "react";
import { QuizState, QuizQuestion } from "@/types/chat";
import { QUIZ_INIT_STATE, QUIZ_DATA } from "@/constants/chatConst";
import {
  initializeRandomizedQuiz,
  clearRandomizedQuizData,
} from "@/utils/randomQuest";

export const useQuizState = () => {
  const [state, setState] = useState<QuizState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("quiz_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn("Failed to parse saved quiz state:", error);
      }
    }
    return QUIZ_INIT_STATE;
  });

  // Initialize randomized questions immediately
  const [randomizedQuestions, setRandomizedQuestions] = useState<
    QuizQuestion[]
  >(() => {
    return initializeRandomizedQuiz(QUIZ_DATA.questions);
  });

  const updateState = useCallback((updates: Partial<QuizState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      localStorage.setItem("quiz_state", JSON.stringify(newState));
      return newState;
    });
  }, []);

  const resetState = useCallback(() => {
    // Reset React state
    setState(QUIZ_INIT_STATE);
    setRandomizedQuestions([]);

    // Remove specific localStorage items
    localStorage.removeItem("lovey_chat_history");
    localStorage.removeItem("quiz_result");
    localStorage.removeItem("quiz_state");
    localStorage.removeItem("used_quiz_questions");

    // Remove specific sessionStorage items
    sessionStorage.removeItem("randomized_quiz_data");

    // Remove specific cookies (e.g., chat_auth)
    document.cookie =
      "chat_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const initializeRandomizedQuestions = useCallback(() => {
    // Only re-randomize if we don't already have questions
    if (randomizedQuestions.length === 0) {
      const randomized = initializeRandomizedQuiz(QUIZ_DATA.questions);
      setRandomizedQuestions(randomized);
      return randomized;
    }
    return randomizedQuestions;
  }, [randomizedQuestions]);

  const getCurrentQuestion = useCallback(() => {
    if (randomizedQuestions.length === 0) return null;
    return randomizedQuestions[state.currentQuestion];
  }, [randomizedQuestions, state.currentQuestion]);

  return {
    state,
    updateState,
    resetState,
    randomizedQuestions,
    initializeRandomizedQuestions,
    getCurrentQuestion,
  };
};
