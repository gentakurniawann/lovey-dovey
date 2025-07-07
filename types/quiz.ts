export interface QuizOption {
  text: string;
  value: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export type ReactionDataset = Record<number | "default", string[]>;

export type ReactionType = "text" | "image" | "combo";

export type ScoredReaction = {
  type: ReactionType;
  text?: string;
  image?: string;
};

export type InteractionStep = {
  type: "message" | "quiz" | "redirect";
  content?: string;
  quizId?: string; // connects to RELATIONSHIP_QUIZ
  redirectTo?: string; // for final step
};

// Types and Interfaces
export interface quizConfig {
  totalQuiz: number;
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


