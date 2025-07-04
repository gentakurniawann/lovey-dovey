import { InteractionStep, QuizQuestion } from "@/types/chat";

export const INTERACTION_FLOW: InteractionStep[] = [
  {
    id: "welcome",
    type: "message",
    content:
      "Okay, be honest — are they flirting, or just bored and kinda hot?",
  },
  {
    id: "intro",
    type: "message",
    content:
      "Let’s unpack your situationship with a quiz that’s 80% accuracy, 20% emotional damage. You in?",
  },
  {
    id: "step-1",
    type: "quiz",
    quizId: "text-conversations",
  },
  {
    id: "step-2",
    type: "quiz",
    quizId: "they-remember",
  },
  {
    id: "step-3",
    type: "quiz",
    quizId: "instagram-likes",
  },
  {
    id: "step-4",
    type: "quiz",
    quizId: "story-posting",
  },
  {
    id: "step-5",
    type: "quiz",
    quizId: "group-settings",
  },
  {
    id: "step-6",
    type: "quiz",
    quizId: "stop-reaching-out",
  },
  {
    id: "step-7",
    type: "quiz",
    quizId: "inside-jokes",
  },
  {
    id: "step-8",
    type: "quiz",
    quizId: "when-sick",
  },
];

export const RELATIONSHIP_QUIZ: QuizQuestion[] = [
  {
    id: "text-conversations",
    question: "Your text conversations are",
    options: [
      {
        value: 1,
        text: "So chaotic and detailed, they could be turned into a Netflix limited series",
      },
      {
        value: 2,
        text: "Actually balanced — they ask questions and share stuff too",
      },
      {
        value: 3,
        text: "You sending paragraphs, them responding with “lol” and “yeah”",
      },
      {
        value: 4,
        text: "Basically you talking to yourself with occasional “k” responses (embarrassing for you, sorry)",
      },
    ],
  },
  {
    id: "they-remember",
    question: "They remember",
    options: [
      {
        value: 1,
        text: "That random thing you mentioned once about your childhood dog",
      },
      { value: 2, text: "Your birthday and major life events" },
      { value: 3, text: "Your name (usually)" },
      {
        value: 4,
        text: "Nothing. You told them your favorite color 47 times and they still guess wrong",
      },
    ],
  },
  {
    id: "instagram-likes",
    question: "Your placement in their Instagram likes",
    options: [
      {
        value: 1,
        text: "Suspiciously consistent early liker - either they love you or have notifications on",
      },
      { value: 2, text: "Usually in the first 10 likes on most posts" },
      { value: 3, text: "Random placement, no pattern whatsoever" },
      {
        value: 4,
        text: "You're basically an archaeological dig - buried so deep in their likes",
      },
    ],
  },
  {
    id: "story-posting",
    question: "When they don't reply but post on their story 20 minutes later",
    options: [
      {
        value: 1,
        text: "This never happens because they actually respect your existence",
      },
      { value: 2, text: "Rare occurrence that doesn't bother you much" },
      {
        value: 3,
        text: "You screenshot it for evidence like you're building a court case",
      },
      {
        value: 4,
        text: "You've entered your villain era and are ready to commit crimes - touch grass immediately",
      },
    ],
  },
  {
    id: "group-settings",
    question: "In group settings, they",
    options: [
      {
        value: 1,
        text: "Make an effort to loop you in — like you’re part of the plot, not just an extra",
      },
      {
        value: 2,
        text: "Talk to you like a functioning human with social skills",
      },
      { value: 3, text: "Nod at you sometimes like a coworker at 9am" },
      {
        value: 4,
        text: "Treat you like a designer chair — nice to have around, but no one’s actually sitting down",
      },
    ],
  },
  {
    id: "stop-reaching-out",
    question: "If you stopped reaching out completely",
    options: [
      { value: 1, text: "They’d notice in like... 2 business days, max" },
      { value: 2, text: "You’d get a “hey u good?” text sometime next week" },
      {
        value: 3,
        text: "One day they’d be like “huh, haven’t seen them in a while” and move on",
      },
      {
        value: 4,
        text: "They’d assume you joined a cult or left the planet and still wouldn’t double-tap your last post",
      },
    ],
  },
  {
    id: "inside-jokes",
    question: "Your inside jokes together",
    options: [
      {
        value: 1,
        text: "Are actually funny and you both reference them regularly",
      },
      { value: 2, text: "Exist and come up in conversation sometimes" },
      {
        value: 3,
        text: "Are mostly you saying things you think are inside jokes",
      },
      {
        value: 4,
        text: "Don't exist because they have the memory retention of a goldfish with amnesia",
      },
    ],
  },
  {
    id: "when-sick",
    question: "When you're sick",
    options: [
      { value: 1, text: "They offer to bring you soup or medicine" },
      { value: 2, text: "They check in to see how you're feeling" },
      { value: 3, text: 'Generic "feel better" text with no follow-up' },
      {
        value: 4,
        text: "They find out you were sick three weeks later through mutual friends",
      },
    ],
  },
];
