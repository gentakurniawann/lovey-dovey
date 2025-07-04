type QuizOption = {
  value: 1 | 2 | 3 | 4;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

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
