// QUIZ
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

export interface QuizOption {
  text: string;
  value: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export type QuizReaction = {
  type: "text" | "meme" | "both";
  text?: string;
  imageUrl?: string;
};

export type ChatMessage =
  | { id: string; type: "bot"; message: string; timestamp?: number }
  | { id: string; type: "user"; message: string; timestamp?: number }
  | { id: string; type: "question"; question: QuizQuestion }
  | { id: string; type: "reaction"; reaction: QuizReaction };

// REACTION
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
