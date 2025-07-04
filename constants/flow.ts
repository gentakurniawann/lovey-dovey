import { InteractionStep } from "@/types/chat";

export const INTERACTION_FLOW: InteractionStep[] = [
  {
    type: "message",
    content: "Hi, my name is Lovey,",
  },
  {
    type: "message",
    content:
      "Let’s unpack your situationship with a quiz that’s 80% accuracy, 20% emotional damage. You in?",
  },
  {
    type: "quiz",
    quizId: "text-conversations",
  },
  {
    type: "quiz",
    quizId: "they-remember",
  },
  {
    type: "quiz",
    quizId: "instagram-likes",
  },
  {
    type: "quiz",
    quizId: "story-posting",
  },
  {
    type: "quiz",
    quizId: "group-settings",
  },
  {
    type: "quiz",
    quizId: "stop-reaching-out",
  },
  {
    type: "quiz",
    quizId: "inside-jokes",
  },
  {
    type: "quiz",
    quizId: "when-sick",
  },
];
