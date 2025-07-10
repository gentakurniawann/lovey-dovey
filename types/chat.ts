export type QuizPhase = "welcome" | "start_quiz" | "questions" | "result";

export type PhaseProgress = "not_started" | "in_progress" | "complete";

export interface ChatMessage {
  id: string;
  type: "bot" | "user";
  message: string; // The actual message content
  timestamp: number;
  reaction?: QuizReaction;
  delayed?: boolean;
}

export interface QuizState {
  totalQuestions: number;
  phase: QuizPhase;
  phaseProgress: PhaseProgress;
  currentQuestion: number;
  answers: number[];
  crushName: string;
  totalScore: number;
}

export interface QuizReaction {
  type: "text" | "meme" | "both";
  text?: string;
  memeUrl?: string;
  memeAlt?: string;
}

type QuizOption = {
  text: string;
  value: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

type BotMessages = {
  welcome: string[];
  afterName: (name: string) => string[];
  questionIntro: (questionNum: number, total: number) => string[];
  results: {
    high: (name: string) => string[];
    medium: (name: string) => string[];
    low: (name: string) => string[];
  };
};

export type QuizData = {
  questions: QuizQuestion[];
  botMessages: BotMessages;
  questionReactions: {
    [key: number]: QuizReaction[];
  };
};

export interface PhaseConfigEntry {
  initialBotMessages: (crushName: string) => string[];
  onComplete: (
    // These are functions from ChatPage to trigger next steps
    startQuiz: () => Promise<void>,
    showResults: (score: number) => Promise<void>,
    // Relevant state data
    crushName: string,
    currentQuestion: number,
    totalScore: number,
    totalQuestions: number
  ) => void;
  // You can add more properties here, e.g., onReloadAction, expectedUserAction, etc.
}
