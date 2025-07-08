export type QuizPhase = "welcome" | "start_quiz" | "questions" | "result";

export interface ChatMessage {

  id: string;
  type: "bot" | "user";
  message: string;
  timestamp: number;
}


export interface QuizState {
  totalQuestions: number
  phase: QuizPhase;
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

type QuizQuestion = {
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
