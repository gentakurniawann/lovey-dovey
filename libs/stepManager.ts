"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Types and Interfaces
export interface StepConfig {
  maxSteps: number;
  defaultStep: number;
  resultPath: string;
  stepBasePath: string;
}

export interface StepResult {
  success: boolean;
  step: number;
  error?: string;
}

export interface StepValidation {
  isValid: boolean;
  currentStep: number;
  requiredStep: number;
}

// Default configuration
const DEFAULT_CONFIG: StepConfig = {
  maxSteps: 8,
  defaultStep: 1,
  resultPath: "/result",
  stepBasePath: "/step",
};

// Core step management functions
export const getCurrentStep = (): number => {
  const stepCookie = Cookies.get("totalStep");
  return stepCookie ? Number(stepCookie) : DEFAULT_CONFIG.defaultStep;
};

export const setCurrentStep = (step: number): number => {
  Cookies.set("totalStep", step.toString(), { expires: 7 });
  return step;
};

export const increaseStep = (): number => {
  const currentStep = getCurrentStep();
  const nextStep = currentStep + 1;
  setCurrentStep(nextStep);
  return nextStep;
};

export const decreaseStep = (): number => {
  const currentStep = getCurrentStep();
  const previousStep = currentStep - 1;
  setCurrentStep(previousStep);
  return previousStep;
};

// Step validation
export const validateStep = (requiredStep: number): boolean => {
  const currentStep = getCurrentStep();
  return currentStep >= requiredStep;
};

// Navigation helpers (for client-side components/hooks)
export const useStepNavigation = (config: StepConfig = DEFAULT_CONFIG) => {
  const router = useRouter();

  const goToNextStep = () => {
    const currentStep = getCurrentStep();
    if (currentStep >= config.maxSteps) {
      router.push(config.resultPath);
    } else {
      const nextStep = increaseStep();
      router.push(`${config.stepBasePath}/${nextStep}`);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    router.push(`${config.stepBasePath}/${step}`);
  };

  const resetSteps = () => {
    setCurrentStep(config.defaultStep);
  };

  return {
    currentStep: getCurrentStep(),
    goToNextStep,
    goToStep,
    resetSteps,
  };
};
