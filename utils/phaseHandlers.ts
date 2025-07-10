import { redirect } from "next/navigation";
import { calculateResult } from "./randomQuest";
import {
  PHASE_CONFIG,
  QUIZ_DATA,
  QUIZ_INIT_STATE,
} from "@/constants/chatConst";
import { QuizState } from "@/types/chat";

export const createPhaseHandlers = (
  state: QuizState,
  updateState: (updates: Partial<QuizState>) => void,
  addBotMessages: (
    messages: string[],
    existing?: any[],
    withDelay?: boolean
  ) => Promise<void>,
  saveExpectedMessages: (
    messages: string[],
    phase: string,
    context: any
  ) => void,
  clearExpectedMessages: (phase: string) => void,
  loadMessages: () => any[]
) => {
  const initWelcome = async () => {
    updateState({ phase: "welcome", phaseProgress: "in_progress" });

    const welcomeMessages = PHASE_CONFIG.welcome.initialBotMessages(
      state.crushName
    );
    saveExpectedMessages(welcomeMessages, "welcome", {
      crushName: state.crushName,
    });

    const currentMessages = loadMessages();
    await addBotMessages(welcomeMessages, currentMessages);
    clearExpectedMessages("welcome");

    updateState({ phaseProgress: "complete" });
  };

  const showResults = async (finalScore: number) => {
    updateState({ phase: "result", phaseProgress: "in_progress" });

    const resultType = calculateResult(
      finalScore,
      QUIZ_INIT_STATE.totalQuestions
    );
    const resultMessages = QUIZ_DATA.botMessages.results[resultType](
      state.crushName
    );

    localStorage.setItem(
      "quiz_result",
      JSON.stringify({
        crushName: state.crushName,
        resultMessages,
        finalScore,
        resultType,
      })
    );

    updateState({ phaseProgress: "complete" });
    redirect("/result");
  };

  return { initWelcome, showResults };
};
