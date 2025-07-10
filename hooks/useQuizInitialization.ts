'use client'

import { useEffect, useRef } from "react";
import { QuizState } from "@/types/chat";
import { PHASE_CONFIG } from "@/constants/chatConst";

export const useQuizInitialization = (
  state: QuizState,
  updateState: (updates: Partial<QuizState>) => void,
  loadMessages: () => any[],
  recoverFromInterruption: () => Promise<void>,
  addBotMessages: (
    messages: string[],
    existing?: any[],
    withDelay?: boolean
  ) => Promise<void>,
  isMessageInHistory: (messageText: string, history: any[]) => boolean,
  startQuiz: () => Promise<void>,
  showResults: (score: number) => Promise<void>,
  initWelcome: () => Promise<void>
) => {
  const hasInitializedRef = useRef(false);
  type PhaseKey = keyof typeof PHASE_CONFIG;

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initializeQuiz();
    }
  }, []);

  const initializeQuiz = async () => {
    await recoverFromInterruption();

    const savedMessages = loadMessages();
    const { phase, phaseProgress, currentQuestion, totalScore, crushName } =
      state;

    if (phaseProgress === "complete") {
      await handleCompletePhase(phase, crushName, savedMessages);
    } else if (phaseProgress === "in_progress") {
      await handleInProgressPhase(phase, crushName, savedMessages);
    } else {
      await initWelcome();
    }
  };

  const handleCompletePhase = async (
    phase: PhaseKey,
    crushName: string,
    savedMessages: any[]
  ) => {
    const config = PHASE_CONFIG[phase];
    if (config?.onComplete) {
      if (phase === "welcome" && crushName?.trim()) {
        await handleWelcomeComplete(crushName, savedMessages);
      } else {
        config.onComplete(
          startQuiz,
          showResults,
          crushName,
          state.currentQuestion,
          state.totalScore,
          state.totalQuestions
        );
      }
    } else if (phase !== "result") {
      await initWelcome();
    }
  };

  const handleWelcomeComplete = async (
    crushName: string,
    savedMessages: any[]
  ) => {
    const startQuizMessages =
      PHASE_CONFIG.start_quiz.initialBotMessages(crushName);
    const hasStartQuizMessages = startQuizMessages.every((msg) =>
      isMessageInHistory(msg, savedMessages)
    );

    if (hasStartQuizMessages) {
      updateState({ phase: "start_quiz", phaseProgress: "complete" });
      setTimeout(() => startQuiz(), 100);
    } else {
      updateState({ phase: "start_quiz", phaseProgress: "in_progress" });
      await addBotMessages(startQuizMessages, savedMessages);
      updateState({ phase: "start_quiz", phaseProgress: "complete" });
      setTimeout(() => startQuiz(), 100);
    }
  };

  const handleInProgressPhase = async (
    phase: PhaseKey,
    crushName: string,
    savedMessages: any[]
  ) => {
    const config = PHASE_CONFIG[phase];
    if (!config) {
      await initWelcome();
      return;
    }

    const expectedInitialMessages = config.initialBotMessages(crushName);
    const allInitialMessagesPresent = expectedInitialMessages.every((msg) =>
      isMessageInHistory(msg, savedMessages)
    );

    if (!allInitialMessagesPresent && expectedInitialMessages.length > 0) {
      await addBotMessages(expectedInitialMessages, savedMessages);
      updateState({ phaseProgress: "complete" });

      if (config.onComplete) {
        config.onComplete(
          startQuiz,
          showResults,
          crushName,
          state.currentQuestion,
          state.totalScore,
          state.totalQuestions
        );
      }
    } else {
      await handleSpecificPhase(phase, crushName, savedMessages);
    }
  };

  const handleSpecificPhase = async (
    phase: string,
    crushName: string,
    savedMessages: any[]
  ) => {
    switch (phase) {
      case "welcome":
        if (crushName?.trim()) {
          await handleWelcomeComplete(crushName, savedMessages);
        }
        break;
      case "start_quiz":
        setTimeout(() => startQuiz(), 100);
        break;
      case "questions":
        // Handle questions phase restoration
        break;
      case "result":
        await showResults(state.totalScore);
        break;
      default:
        await initWelcome();
    }
  };
};
