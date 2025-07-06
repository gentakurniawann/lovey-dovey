import { QuizQuestion } from "@/types/chat";

export const RELATIONSHIP_QUIZ: QuizQuestion[] = [
  {
    id: "q_text_convo",
    question: "Your text conversations are...",
    options: [
      {
        text: "So chaotic and detailed, they could be turned into a Netflix limited series",
        value: 4,
      },
      {
        text: "Actually balanced — they ask questions and share stuff too",
        value: 3,
      },
      {
        text: "You sending paragraphs, them responding with “lol” and “yeah”",
        value: 2,
      },
      {
        text: "Basically you talking to yourself with occasional “k” responses (embarrassing for you, sorry)",
        value: 1,
      },
    ],
  },
  {
    id: "q_memory",
    question: "They remember...",
    options: [
      {
        text: "That random thing you mentioned once about your childhood dog",
        value: 4,
      },
      { text: "Your birthday and major life events", value: 3 },
      { text: "Your name (usually)", value: 2 },
      {
        text: "Nothing. You told them your favorite color 47 times and they still guess wrong",
        value: 1,
      },
    ],
  },
  {
    id: "q_ig_likes",
    question: "Your placement in their Instagram likes...",
    options: [
      {
        text: "Suspiciously consistent early liker - either they love you or have notifications on",
        value: 4,
      },
      { text: "Usually in the first 10 likes on most posts", value: 3 },
      { text: "Random placement, no pattern whatsoever", value: 2 },
      {
        text: "You're basically an archaeological dig - buried so deep in their likes",
        value: 1,
      },
    ],
  },
  {
    id: "q_ignoring_story",
    question:
      "When they don't reply but post on their story 20 minutes later...",
    options: [
      {
        text: "This never happens because they actually respect your existence",
        value: 4,
      },
      { text: "Rare occurrence that doesn't bother you much", value: 3 },
      {
        text: "You screenshot it for evidence like you're building a court case",
        value: 2,
      },
      {
        text: "You've entered your villain era and are ready to commit crimes - touch grass immediately",
        value: 1,
      },
    ],
  },
  {
    id: "q_group_setting",
    question: "In group settings, they...",
    options: [
      {
        text: "Make an effort to loop you in — like you’re part of the plot, not just an extra",
        value: 4,
      },
      {
        text: "Talk to you like a functioning human with social skills",
        value: 3,
      },
      { text: "Nod at you sometimes like a coworker at 9am", value: 2 },
      {
        text: "Treat you like a designer chair — nice to have around, but no one’s actually sitting down",
        value: 1,
      },
    ],
  },
  {
    id: "q_stop_reaching",
    question: "If you stopped reaching out completely...",
    options: [
      { text: "They’d notice in like... 2 business days, max", value: 4 },
      { text: "You’d get a “hey u good?” text sometime next week", value: 3 },
      {
        text: "One day they’d be like “huh, haven’t seen them in a while” and move on",
        value: 2,
      },
      {
        text: "They’d assume you joined a cult or left the planet and still wouldn’t double-tap your last post",
        value: 1,
      },
    ],
  },
  {
    id: "q_inside_jokes",
    question: "Your inside jokes together...",
    options: [
      {
        text: "Are actually funny and you both reference them regularly",
        value: 4,
      },
      { text: "Exist and come up in conversation sometimes", value: 3 },
      {
        text: "Are mostly you saying things you think are inside jokes",
        value: 2,
      },
      {
        text: "Don't exist because they have the memory retention of a goldfish with amnesia",
        value: 1,
      },
    ],
  },
  {
    id: "q_sick",
    question: "When you're sick...",
    options: [
      { text: "They offer to bring you soup or medicine", value: 4 },
      { text: "They check in to see how you're feeling", value: 3 },
      { text: 'Generic "feel better" text with no follow-up', value: 2 },
      {
        text: "They find out you were sick three weeks later through mutual friends",
        value: 1,
      },
    ],
  },
];
