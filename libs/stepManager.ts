"use client";

import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { COOKIE_KEYS } from "@/constants/stepConst";
import { QuizPhase } from "@/types/step";
import { QUIZ_STEPPER } from "@/constants/stepConst";

// Cookie for authorization
export const setCurrStep = (currentStep: QuizPhase) => {
  Cookies.set(COOKIE_KEYS.STEPPER, currentStep, { expires: 7 });
};

export const getCurrStep = (): string => {
  return Cookies.get(COOKIE_KEYS.STEPPER) || QUIZ_STEPPER.WELCOME;
};

