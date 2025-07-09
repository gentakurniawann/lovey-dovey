import { PhaseConfigEntry, QuizData, QuizPhase } from "@/types/chat";

export const QUIZ_DATA: QuizData = {
  questions: [
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
  ],

  botMessages: {
    welcome: [
      "Hey, I'm Lovey 💖 I'm here to help you figure out your crush.",
      "First things first... what's their name?",
    ],
    afterName: (name: string) => [
      `Ooooh ${name} 👀 Let's get into it.`,
      "Ready to find out if this crush is going somewhere? Let's start!",
    ],
    questionIntro: (questionNum: number, total: number) => [
      `Question ${questionNum} of ${total}:`,
    ],
    results: {
      high: (name: string) => [
        `OMG! You and ${name} are giving major soulmate energy! 🔥`,
        "This crush is DEFINITELY mutual. Time to make a move! 💕",
      ],
      medium: (name: string) => [
        `You and ${name} have some solid potential! 😊`,
        "There's definitely something there, but maybe take it slow and see how it develops!",
      ],
      low: (name: string) => [
        `Hmm, ${name} might not be feeling the same energy... 😔`,
        "But hey, sometimes the best relationships start as friendships! Don't give up hope! 💪",
      ],
    },
  },

  questionReactions: {
    4: [
      // High score reactions
      // { type: "text", text: "Soulmate energy! 🔥" },
      // {
      //   type: "meme",
      //   memeUrl: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
      //   memeAlt: "Heart eyes",
      // },
      {
        type: "both",
        text: "You two are PERFECT together!",
        memeUrl: "https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif",
        memeAlt: "Couple goals",
      },
    ],
    3: [
      // Medium-high score reactions
      // { type: "text", text: "Ooh, looking promising! 😊" },
      // {
      //   type: "meme",
      //   memeUrl: "https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif",
      //   memeAlt: "Thinking face",
      // },
      {
        type: "both",
        text: "This could be something special!",
        memeUrl: "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
        memeAlt: "Excited",
      },
    ],
    2: [
      // { type: "text", text: "Hmm... interesting choice 🤔" },
      // {
      //   type: "meme",
      //   memeUrl: "https://media.giphy.com/media/a5viI92PAF89q/giphy.gif",
      //   memeAlt: "Awkward",
      // },
      {
        type: "both",
        text: "Well, that's... something",
        memeUrl: "https://media.giphy.com/media/32mC2kXYWCsg0/giphy.gif",
        memeAlt: "Confused",
      },
    ],
    1: [
      // Low score reactions
      // { type: "text", text: "Oh honey... 😬" },
      // {
      //   type: "meme",
      //   memeUrl: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
      //   memeAlt: "Disappointed",
      // },
      {
        type: "both",
        text: "Yikes! Red flag alert!",
        memeUrl: "https://media.giphy.com/media/JYZ397GsFrFtu/giphy.gif",
        memeAlt: "Red flag",
      },
    ],
  },
};

export const PHASE_CONFIG: { [key in QuizPhase]: PhaseConfigEntry } = {
  welcome: {
    initialBotMessages: () => QUIZ_DATA.botMessages.welcome,
    onComplete: (
      startQuiz,
      showResults,
      crushName,
      currentQuestion,
      totalScore,
      totalQuestions
    ) => {
      // After welcome messages, we wait for name input.
      // The name submit handler will then transition to 'start_quiz' messages.
      // No direct automated action here, as it's user-driven.
    },
  },
  start_quiz: {
    initialBotMessages: (crushName: string) =>
      QUIZ_DATA.botMessages.afterName(crushName),
    onComplete: (
      startQuiz,
      showResults,
      crushName,
      currentQuestion,
      totalScore,
      totalQuestions
    ) => {
      // After start_quiz messages are sent, we initiate the actual quiz (questions phase)
      setTimeout(() => startQuiz(), 500);
    },
  },
  questions: {
    // Questions don't have a single fixed set of initial messages for the phase itself,
    // as each question is a dynamic message sequence.
    // The `presentQuestion` function handles adding these.
    initialBotMessages: (crushName: string) => [], // No fixed initial messages for the phase
    onComplete: (
      startQuiz,
      showResults,
      crushName,
      currentQuestion,
      totalScore,
      totalQuestions
    ) => {
      // After all questions are answered, show results
      setTimeout(() => showResults(totalScore), 500);
    },
  },
  result: {
    // Result messages are dynamic based on score.
    // The `showResults` function handles adding these.
    initialBotMessages: (crushName: string) => [
      "Calculating your crush compatibility...",
      "...",
    ], // These are the initial fixed messages for the result phase
    onComplete: (
      startQuiz,
      showResults,
      crushName,
      currentQuestion,
      totalScore,
      totalQuestions
    ) => {
      // Quiz is fully complete, nothing more to do automatically.
      // The UI will display the restart button.
    },
  },
};
