"use client";

import { DEFAULT_CONFIG } from "@/constants/quizConst";
import { quizConfig } from "@/types/quiz";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { COOKIE_KEYS } from "@/constants/quizConst";

export const setTotalQuiz = (step: number): number => {
  Cookies.set(COOKIE_KEYS.QUIZ_COUNT, step.toString(), { expires: 7 });
  return step;
};

export const getTotalQuiz = (): number => {
  const stepCookie = Cookies.get(COOKIE_KEYS.QUIZ_COUNT);
  return stepCookie ? Number(stepCookie) : DEFAULT_CONFIG.totalQuiz;
};

export const decreaseTotalQuiz = (): number => {
  const currentStep = getTotalQuiz();
  if (currentStep <= 0) {
    console.warn("Attempted to decrease step below 0. Action prevented.");
    return 0;
  }
  const previousStep = currentStep - 1;
  setTotalQuiz(previousStep);
  return previousStep;
};
