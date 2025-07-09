"use client";

import { ChatMessage, QuizState } from "@/types/chat";
import Cookies from "js-cookie";

export const saveChatHistory = (history: ChatMessage[]) => {
  try {
    Cookies.set("chatHistory", JSON.stringify(history), { expires: 7 });
  } catch (error) {
    console.warn("Failed to save chat history:", error);
  }
};

export const loadChatHistory = (): ChatMessage[] => {
  try {
    const raw = Cookies.get("chatHistory");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Failed to load chat history:", error);
    return [];
  }
};

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
    console.log(state, "ini update state");
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

    console.log(updatedState, "ini update state");
    saveChatState(updatedState);
  } catch (error) {
    console.warn("Failed to update quiz state in cookies:", error);
  }
};

export const loadChatState = (): QuizState => {
  try {
    const savedState = Cookies.get("quizState");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.warn("Failed to load quiz state from cookies:", error);
  }
  return {
    totalQuestions: 8,
    phase: "welcome",
    phaseProgress: "not_started",
    currentQuestion: 0,
    answers: [],
    crushName: "",
    totalScore: 0,
  };
};
