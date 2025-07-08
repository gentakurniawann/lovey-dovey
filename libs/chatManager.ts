"use client";

import { QuizState } from "@/types/chat";
import Cookies from "js-cookie";

export const saveQuizState = (state: QuizState) => {
  try {
    Cookies.set("quizState", JSON.stringify(state), { expires: 7 });
  } catch (error) {
    console.warn("Failed to save quiz state to cookies:", error);
  }
};

export const loadQuizState = (): QuizState => {
  console.log('masuk ke load quiz state ')
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
    phase: "welcome",
    currentQuestion: 0,
    answers: [],
    crushName: "",
    totalScore: 0,
  };
};
