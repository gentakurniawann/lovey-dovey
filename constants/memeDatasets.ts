import { ScoredReaction } from "@/types/chat";

export const REACTIONS_BY_SCORE: Record<1 | 2 | 3 | 4, ScoredReaction[]> = {
  1: [
    { type: "text", text: "They saw it. They ignored it. Move on." },
    { type: "text", text: "They’re not shy. They’re just not texting you." },

    {
      type: "text",
      text: "Your crush is a myth. Like good Wi-Fi in the basement.",
    },
    { type: "image", image: "/memes/ghost.gif" },
    { type: "image", image: "/memes/nope.gif" },
    { type: "image", image: "/memes/clown.gif" },
    {
      type: "combo",
      text: "It’s not slow-burn. It’s no-burn.",
      image: "/memes/cold.gif",
    },
    {
      type: "combo",
      text: "You deserve better. Like literally anyone else.",
      image: "/memes/better.gif",
    },
    {
      type: "combo",
      text: "If ignoring was an Olympic sport… gold medal.",
      image: "/memes/gold-medal.gif",
    },
  ],
  2: [
    { type: "text", text: "This isn't flirting — it's digital neglect." },
    { type: "text", text: "You're doing all the work. And for what?" },
    { type: "text", text: "He thinks 'communication' is a personality flaw." },
    { type: "image", image: "/memes/delete-number.gif" },
    { type: "image", image: "/memes/left-on-read.gif" },
    {
      type: "combo",
      text: "You're the only one in this situationship. Sorry babe.",
      image: "/memes/foreveralone.gif",
    },
    {
      type: "combo",
      text: "He’s emotionally available… for someone else.",
      image: "/memes/not-you.gif",
    },
  ],
  3: [
    {
      type: "text",
      text: "You're dating a ghost. Except it’s not even spooky, just sad.",
    },
    { type: "text", text: "Delete his number. Or at least his contact photo." },
    { type: "image", image: "/memes/block-button.gif" },
    { type: "image", image: "/memes/ghosted.gif" },
    { type: "image", image: "/memes/wake-up.gif" },
    {
      type: "combo",
      text: "You're not even friend-zoned. You're air.",
      image: "/memes/invisible.gif",
    },
    {
      type: "combo",
      text: "He treats you like a notification he swipes away.",
      image: "/memes/notification-swipe.gif",
    },
    {
      type: "combo",
      text: "Delete the chat. Reclaim your power.",
      image: "/memes/delete.gif",
    },
  ],
  4: [
    { type: "text", text: "You’re not overthinking. They’re underperforming." },
    { type: "text", text: "I`t's not a mixed signal. It's a stop sign." },
    { type: "image", image: "/memes/fake-smile.gif" },
    { type: "image", image: "/memes/tumbleweed.gif" },
    {
      type: "combo",
      text: "This isn't love. It's emotional cardio.",
      image: "/memes/jogging.gif",
    },
    {
      type: "combo",
      text: "When he texts 'wyd' once a week at 2AM, that’s not affection.",
      image: "/memes/wyd.gif",
    },
  ],
};
