"use client";

import { ChatMessage, QuizState } from "@/types/chat";
import Cookies from "js-cookie";

export const setChatHistory = (message: string, type: "bot" | "user") => {
  const newMessage: ChatMessage = {
    id: crypto.randomUUID(),
    type,
    message,
    timestamp: Date.now(),
  };
  const existing = Cookies.get("chatHistory");
  const history: ChatMessage[] = existing ? JSON.parse(existing) : [];
  history.push(newMessage);
  Cookies.set("chatHistory", JSON.stringify(history), { expires: 7 });
};

export const saveChatState = (state: QuizState) => {
  try {
    Cookies.set("quizState", JSON.stringify(state), { expires: 7 });
  } catch (error) {
    console.warn("Failed to save quiz state to cookies:", error);
  }
};

export const updateChatState = (updates: Partial<QuizState>) => {
  try {
    const existingStateStr = Cookies.get("quizState");
    const existingState: QuizState = existingStateStr
      ? JSON.parse(existingStateStr)
      : {
          phase: "welcome",
          currentQuestion: 0,
          answers: [],
          crushName: "",
          totalScore: 0,
        };

    const updatedState = { ...existingState, ...updates };
    saveChatState(updatedState);
  } catch (error) {
    console.warn("Failed to update quiz state in cookies:", error);
  }
};

export const loadChatState = (): QuizState => {
  try {
    const savedState = Cookies.get("quizState");
    console.log(savedState, "saved state di cookie");
    if (savedState) {
      console.log(savedState, "ini statenya");
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.warn("Failed to load quiz state from cookies:", error);
  }
  return {
    totalQuestions: 8,
    phase: "welcome",
    currentQuestion: 0,
    answers: [],
    crushName: "",
    totalScore: 0,
  };
};
