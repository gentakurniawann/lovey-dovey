import {
  PhaseConfigEntry,
  QuizData,
  QuizPhase,
  QuizReaction,
  QuizState,
  QuizQuestion,
} from "@/types/chat";

export const QUIZ_INIT_STATE: QuizState = {
  phase: "welcome",
  phaseProgress: "not_started",
  currentQuestion: 0,
  answers: [],
  crushName: "",
  totalScore: 0,
  totalQuestions: 8,
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q_text_convo",
    question: "Your text conversations are...",
    options: [
      {
        text: "Actual conversations where both parties contribute thoughts like functioning humans",
        value: 4,
      },
      {
        text: "Mostly balanced, though you definitely carry the emotional labor",
        value: 3,
      },
      {
        text: "You writing the Great American Novel, them replying 'lmao' to your trauma dumps",
        value: 2,
      },
      {
        text: "A one-person show where you're both the star and the only audience member",
        value: 1,
      },
    ],
  },
  {
    id: "q_memory",
    question: "They remember...",
    options: [
      {
        text: "Weirdly specific details about your life that even you forgot",
        value: 4,
      },
      { text: "The important stuff and occasionally surprise you", value: 3 },
      { text: "Your name and approximately what you look like", value: 2 },
      {
        text: "Absolutely nothing. You could tell them you're moving to Mars and they'd ask 'wait, when?'",
        value: 1,
      },
    ],
  },
  {
    id: "q_ig_likes",
    question: "Your Instagram likes placement reveals...",
    options: [
      {
        text: "They're either obsessed with you or have notifications on (both equally concerning)",
        value: 4,
      },
      { text: "Consistent top 10 energy - they see you", value: 3 },
      { text: "Random chaos, no detectable pattern or care", value: 2 },
      {
        text: "You're mining for their validation in the depths of like #247",
        value: 1,
      },
    ],
  },
  {
    id: "q_ignoring_story",
    question: "When they ghost your text but post a story 10 minutes later...",
    options: [
      {
        text: "This doesn't happen because they're not a sociopath",
        value: 4,
      },
      { text: "Rare enough that you don't plot their demise", value: 3 },
      {
        text: "You screenshot it like you're collecting evidence for friend court",
        value: 2,
      },
      {
        text: "You've entered your villain era and are googling 'how to curse someone'",
        value: 1,
      },
    ],
  },
  {
    id: "q_group_setting",
    question: "In group settings, they...",
    options: [
      {
        text: "Actually include you in conversations like you're a real person",
        value: 4,
      },
      {
        text: "Acknowledge your existence with words and eye contact",
        value: 3,
      },
      { text: "Give you the same energy as a distant coworker", value: 2 },
      {
        text: "Treat you like background furniture - decorative but ultimately irrelevant",
        value: 1,
      },
    ],
  },
  {
    id: "q_stop_reaching",
    question: "If you stopped texting them first...",
    options: [
      {
        text: "They'd reach out within 48 hours asking what's wrong",
        value: 4,
      },
      { text: "You'd get a 'hey stranger' text within a week", value: 3 },
      {
        text: "They'd eventually notice and send a generic 'we should hang out' text",
        value: 2,
      },
      {
        text: "They'd assume you died and still wouldn't check on your corpse",
        value: 1,
      },
    ],
  },
  {
    id: "q_inside_jokes",
    question: "Your inside jokes...",
    options: [
      {
        text: "Are genuinely funny and you both reference them without it being weird",
        value: 4,
      },
      { text: "Exist and occasionally resurface in conversation", value: 3 },
      {
        text: "Are mostly you saying things you think are inside jokes while they nod politely",
        value: 2,
      },
      {
        text: "Don't exist because they have the memory span of a fruit fly",
        value: 1,
      },
    ],
  },
  {
    id: "q_sick",
    question: "When you're sick...",
    options: [
      {
        text: "They offer actual help or at least decent sympathy",
        value: 4,
      },
      { text: "They check in like a normal friend would", value: 3 },
      { text: "Generic 'feel better' text that feels copy-pasted", value: 2 },
      {
        text: "They find out you were dying through Instagram stories three weeks later",
        value: 1,
      },
    ],
  },
  {
    id: "q_plans_cancel",
    question: "When they cancel plans last minute...",
    options: [
      {
        text: "They actually reschedule and follow through like a decent human",
        value: 4,
      },
      {
        text: "They apologize and make concrete plans to make it up to you",
        value: 3,
      },
      {
        text: "Generic 'sorry something came up' with vague future promises",
        value: 2,
      },
      {
        text: "They ghost you then post stories of them doing literally anything else",
        value: 1,
      },
    ],
  },
  {
    id: "q_good_news",
    question: "When you share good news...",
    options: [
      {
        text: "They're genuinely excited and ask follow-up questions",
        value: 4,
      },
      {
        text: "Appropriate level of enthusiasm and congratulations",
        value: 3,
      },
      {
        text: "Polite 'congrats' then immediately changes subject to themselves",
        value: 2,
      },
      {
        text: "Responds with something about their own life or just leaves you on read",
        value: 1,
      },
    ],
  },
  {
    id: "q_spotify_stalking",
    question: "Your Spotify activity on their phone...",
    options: [
      {
        text: "They actually listen to songs you recommend and tell you about it",
        value: 4,
      },
      {
        text: "They check it occasionally and comment on your music taste",
        value: 3,
      },
      {
        text: "They screenshot your embarrassing song choices to mock you",
        value: 2,
      },
      {
        text: "They don't even know you exist on Spotify despite being friends for years",
        value: 1,
      },
    ],
  },
  {
    id: "q_drunk_texts",
    question: "Their drunk texts to you are...",
    options: [
      {
        text: "Sweet messages about how much they appreciate your friendship",
        value: 4,
      },
      {
        text: "Funny nonsense that you both laugh about later",
        value: 3,
      },
      {
        text: "Exclusively asking for advice about their messy life",
        value: 2,
      },
      {
        text: "Non-existent because they don't think of you even when inhibitions are gone",
        value: 1,
      },
    ],
  },
  {
    id: "q_story_reactions",
    question: "When you post a story...",
    options: [
      {
        text: "They react or reply with actual thoughts like a normal person",
        value: 4,
      },
      {
        text: "Consistent likes and occasional comments",
        value: 3,
      },
      {
        text: "They watch it but never react, like a social media ghost",
        value: 2,
      },
      {
        text: "They don't even watch your stories but somehow see everyone else's",
        value: 1,
      },
    ],
  },
  {
    id: "q_mutual_friends",
    question: "Around mutual friends, they...",
    options: [
      {
        text: "Reference shared experiences and include you naturally",
        value: 4,
      },
      {
        text: "Treat you the same as when you're alone together",
        value: 3,
      },
      {
        text: "Act slightly different but still acknowledge you exist",
        value: 2,
      },
      {
        text: "Transform into a completely different person and pretend you're strangers",
        value: 1,
      },
    ],
  },
  {
    id: "q_relationship_drama",
    question: "When they have relationship drama...",
    options: [
      {
        text: "They come to you for advice and actually listen to your input",
        value: 4,
      },
      {
        text: "They vent to you and seem to value your perspective",
        value: 3,
      },
      {
        text: "They trauma dump on you then ignore your advice completely",
        value: 2,
      },
      {
        text: "You find out about their breakup through their Instagram caption",
        value: 1,
      },
    ],
  },
  {
    id: "q_birthday_energy",
    question: "Your birthday to them is...",
    options: [
      {
        text: "An actual event they plan for and make special",
        value: 4,
      },
      {
        text: "Remembered and celebrated appropriately",
        value: 3,
      },
      {
        text: "A last-minute 'happy birthday' text because Instagram reminded them",
        value: 2,
      },
      {
        text: "Completely forgotten until you post about it, then maybe they'll care",
        value: 1,
      },
    ],
  },
  {
    id: "q_dm_reactions",
    question: "When you send them memes/TikToks...",
    options: [
      {
        text: "They actually respond with thoughts or send stuff back",
        value: 4,
      },
      {
        text: "Consistent reactions and occasional replies",
        value: 3,
      },
      {
        text: "Just hearts or laughing emojis (what does this MEAN?)",
        value: 2,
      },
      {
        text: "They open it but don't react (emotional damage)",
        value: 1,
      },
    ],
  },
  {
    id: "q_late_night_texts",
    question: "Late night texting energy...",
    options: [
      {
        text: "Deep conversations that last until 3am without being weird",
        value: 4,
      },
      {
        text: "They actually engage when you text late instead of leaving you hanging",
        value: 3,
      },
      {
        text: "Random 'wyd' texts at midnight with no follow-through",
        value: 2,
      },
      {
        text: "They're active but ignore your texts (why are you like this)",
        value: 1,
      },
    ],
  },
  {
    id: "q_group_chat_attention",
    question: "In group chats, they...",
    options: [
      {
        text: "Actually respond to your messages and build on your jokes",
        value: 4,
      },
      {
        text: "React to your messages more than others (we see you)",
        value: 3,
      },
      {
        text: "Respond to everyone except you (this is psychological warfare)",
        value: 2,
      },
      {
        text: "Are active but pretend your messages don't exist",
        value: 1,
      },
    ],
  },
];

export const QUESTION_REACTION: { [key: number]: QuizReaction[] } = {
  4: [
    // High compatibility - Stan Twitter approved
    {
      type: "both",
      text: "THIS IS IT.",
      memeUrl: "https://media.giphy.com/media/26FLgGTPUDH6UGAbm/giphy.gif",
      memeAlt: "Beyonce nodding approvingly",
    },
    {
      type: "both",
      text: "no bc why did i just SCREAM",
      memeUrl: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
      memeAlt: "Screaming in excitement",
    },
    {
      type: "both",
      text: "y'all are genuinely iconic idc idc",
      memeUrl: "https://media.giphy.com/media/3o85xIO9I2b8DzTdcI/giphy.gif",
      memeAlt: "Clapping enthusiastically",
    },
    {
      type: "text",
      text: "when it's right it's RIGHT and this is so right",
    },
    {
      type: "both",
      text: "the universe said MATCH MADE ✨",
      memeUrl: "https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif",
      memeAlt: "Celebrating with sparkles",
    },
    {
      type: "both",
      text: "okay this is actually perfect",
      memeUrl: "https://media.giphy.com/media/26FLgGTPUDH6UGAbm/giphy.gif",
      memeAlt: "Nodding approvingly",
    },
    {
      type: "both",
      text: "no bc this just makes sense",
      memeUrl: "https://media.giphy.com/media/3o85xIO9I2b8DzTdcI/giphy.gif",
      memeAlt: "Clapping",
    },
    {
      type: "text",
      text: "when it's right it's RIGHT",
    },
    {
      type: "both",
      text: "the universe said MATCH MADE ✨",
      memeUrl: "https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif",
      memeAlt: "Celebrating",
    },
    {
      type: "text",
      text: "finally someone with good taste",
    },
    {
      type: "both",
      text: "congratulations you passed the vibe check",
      memeUrl: "https://media.giphy.com/media/26tknCqiJrBQG6bxC/giphy.gif",
      memeAlt: "Impressed",
    },
  ],

  3: [
    // Good compatibility - Cautiously optimistic stan energy
    {
      type: "both",
      text: "okay wait... this might work",
      memeUrl: "https://media.giphy.com/media/3o7527ehSNAvMYfzPi/giphy.gif",
      memeAlt: "Intrigued expression",
    },
    {
      type: "text",
      text: "lowkey invested in this now...",
    },
    {
      type: "both",
      text: "the math is mathing actually",
      memeUrl: "https://media.giphy.com/media/DHqth0hVQoIzS/giphy.gif",
      memeAlt: "Calculating",
    },
    {
      type: "text",
      text: "this could be cute don't mess it up",
    },
    {
      type: "text",
      text: "not bad... you're learning",
    },
    {
      type: "both",
      text: "i'm cautiously optimistic about this chaos",
      memeUrl: "https://media.giphy.com/media/l0MYGb8173drPgj5S/giphy.gif",
      memeAlt: "Considering thoughtfully",
    },
    {
      type: "both",
      text: "okay wait... this might actually serve",
      memeUrl: "https://media.giphy.com/media/3o7527ehSNAvMYfzPi/giphy.gif",
      memeAlt: "Intrigued expression",
    },
    {
      type: "text",
      text: "not me being lowkey invested in this now...",
    },
    {
      type: "both",
      text: "giving potential main character energy ngl",
      memeUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTZpZ2NreWVlbjJlazFubjRlOW1rbnV0Z21ydG9rcTJqdTY3MnYwbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DYH297XiCS2Ck/giphy.gif",
      memeAlt: "Considering thoughtfully",
    },
    {
      type: "both",
      text: "hmm... the math is mathing actually",
      memeUrl: "https://media.giphy.com/media/DHqth0hVQoIzS/giphy.gif",
      memeAlt: "Calculating",
    },
    {
      type: "text",
      text: "this could be cute if y'all don't fumble it",
    },
  ],

  2: [
    // Meh compatibility - Neutral/skeptical stan energy
    {
      type: "both",
      text: "hmm... are we sure about this?",
      memeUrl: "https://media.giphy.com/media/26BROrSHlmyzzHf3i/giphy.gif",
      memeAlt: "Side eye",
    },
    {
      type: "text",
      text: "the silence is loud rn...",
    },
    {
      type: "both",
      text: "it's giving... experimental",
      memeUrl: "https://media.giphy.com/media/l46CyJmS9KUbokzsI/giphy.gif",
      memeAlt: "Uncertain face",
    },
    {
      type: "text",
      text: "this is mid but go off i guess",
    },
    {
      type: "text",
      text: "well that's... a choice",
    },
    {
      type: "both",
      text: "bless your heart for trying",
      memeUrl: "https://media.giphy.com/media/65os7odbIW6pa/giphy.gif",
      memeAlt: "Politely moving on",
    },
    {
      type: "text",
      text: "i mean... if you say so",
    },
    {
      type: "both",
      text: "so... are we sure about this one?",
      memeUrl: "https://media.giphy.com/media/26BROrSHlmyzzHf3i/giphy.gif",
      memeAlt: "Side eye",
    },
    {
      type: "text",
      text: "the silence is so loud rn...",
    },
    {
      type: "both",
      text: "it's giving... experimental era",
      memeUrl: "https://media.giphy.com/media/l46CyJmS9KUbokzsI/giphy.gif",
      memeAlt: "Uncertain face",
    },
    {
      type: "both",
      text: "anyway so",
      memeUrl: "https://media.giphy.com/media/65os7odbIW6pa/giphy.gif",
      memeAlt: "Moving on",
    },
    {
      type: "text",
      text: "not this being mid but go off i guess",
    },
    {
      type: "text",
      text: "must have been the wind",
    },
  ],

  1: [
    // Low compatibility - Brutal stan Twitter honesty
    {
      type: "both",
      text: "oh... this is not it 😭",
      memeUrl: "https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif",
      memeAlt: "Cringing",
    },
    {
      type: "text",
      text: "who told you this was the move",
    },
    {
      type: "both",
      text: "the secondhand embarrassment is real",
      memeUrl: "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif",
      memeAlt: "Facepalm",
    },
    {
      type: "both",
      text: "this ain't it... this is NOT it",
      memeUrl: "https://media.giphy.com/media/3o7527LvROwYIQW7YY/giphy.gif",
      memeAlt: "Shaking head no",
    },
    {
      type: "text",
      text: "sir this is a wendy's",
    },
    {
      type: "both",
      text: "the audacity is truly impressive",
      memeUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnFsaXYzOHhja29seXlrOW02bmIwemRuYno1dmtlYnFqZHJqcnRieiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tPdYQaW6oCIOA/giphy.gif",
      memeAlt: "Slow clap",
    },
    {
      type: "text",
      text: "you really thought this was going somewhere",
    },
    {
      type: "both",
      text: "gravity called, it wants its L back",
      memeUrl: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
      memeAlt: "Disappointed",
    },
    {
      type: "both",
      text: "PLEASEEE not this combination 😭",
      memeUrl: "https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif",
      memeAlt: "Cringing hard",
    },
    {
      type: "text",
      text: "who lied to you and said this was it",
    },
    {
      type: "both",
      text: "the secondhand embarrassment is REAL",
      memeUrl: "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif",
      memeAlt: "Facepalm",
    },
    {
      type: "both",
      text: "this ain't it chief... this is NOT it",
      memeUrl: "https://media.giphy.com/media/3o7527LvROwYIQW7YY/giphy.gif",
      memeAlt: "Shaking head no",
    },
    {
      type: "text",
      text: "babes we need to have a conversation about your taste",
    },
    {
      type: "both",
      text: "the way i just GASPED... and not in a good way",
      memeUrl: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
      memeAlt: "Shocked and disappointed",
    },
  ],
};

export const QUIZ_DATA: QuizData = {
  questions: QUIZ_QUESTIONS,
  questionReactions: QUESTION_REACTION,
  botMessages: {
    welcome: [
      "Oh great, another person who can't tell if someone likes them.",
      "My name is Lovey, let's play detective. What's their name?",
    ],
    afterName: (name: string) => [
      `${name}, huh? Let me guess - they smiled at you once and now you're planning your wedding.`,
      "Alright, let's see if your crush radar is working or if you need a tune-up.",
    ],
    questionIntro: (questionNum: number, total: number) => [
      `Question ${questionNum} of ${total}:`,
    ],
    results: {
      high: (name: string) => [
        `Well would you look at that - ${name} actually seems into you.`,
        "Time to stop overthinking and actually do something about it.",
      ],
      medium: (name: string) => [
        `${name} is giving you some decent signals, but nothing earth-shattering.`,
        "Could go either way. Welcome to the wonderful world of uncertainty.",
      ],
      low: (name: string) => [
        `Hate to break it to you, but ${name} is probably just being friendly.`,
        "Maybe it's time to explore other options. The sea is full of fish, etc.",
      ],
    },
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
