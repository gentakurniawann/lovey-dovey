import { ChatMessage, QuizState } from "@/types/chat";

const CHAT_STATE_KEY = "lovey_quiz_state";
const CHAT_HISTORY_KEY = "lovey_chat_history";

export const saveChatState = (state: QuizState) => {
  try {
    localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save chat state to localStorage", error);
  }
};

export const loadChatState = (): QuizState => {
  try {
    const savedState = localStorage.getItem(CHAT_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Failed to load chat state from localStorage", error);
  }
  // Default initial state if nothing is saved or an error occurs
  return {
    phase: "welcome",
    phaseProgress: "not_started",
    currentQuestion: 0,
    answers: [],
    crushName: "",
    totalScore: 0,
    totalQuestions: 8, // This should ideally be derived from QUIZ_DATA.questions.length
  };
};

export const saveChatHistory = (history: ChatMessage[]) => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save chat history to localStorage", error);
  }
};

export const loadChatHistory = (): ChatMessage[] => {
  try {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error("Failed to load chat history from localStorage", error);
  }
  return [];
};
