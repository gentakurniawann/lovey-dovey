"use client";

import { useState, useCallback } from "react";
import { ChatMessage, QuizReaction } from "@/types/chat";
import { delay } from "@/utils/randomQuest";

export const useBotMessages = (
  addMessage: (
    message: string,
    type: "bot" | "user",
    reaction?: QuizReaction
  ) => ChatMessage,
  isMessageInHistory: (messageText: string, history: ChatMessage[]) => boolean
) => {
  const [isTyping, setIsTyping] = useState(false);

  const addBotMessages = useCallback(
    async (
      messagesToAdd: string[],
      existingMessages: ChatMessage[] = [],
      withDelay: boolean = true
    ) => {
      let currentMessages = existingMessages;

      for (let i = 0; i < messagesToAdd.length; i++) {
        const message = messagesToAdd[i];

        if (!isMessageInHistory(message, currentMessages)) {
          try {
            if (withDelay) {
              setIsTyping(true);
              await delay(500 + Math.random() * 1000);
              setIsTyping(false);
            }

            const newMessage = addMessage(message, "bot");
            currentMessages = [...currentMessages, newMessage];

            if (withDelay) {
              await delay(500);
            }
          } catch (error) {
            console.error("Error adding message:", error);
            setIsTyping(false);
          }
        }
      }
    },
    [addMessage, isMessageInHistory]
  );

  const addReaction = useCallback(
    async (reaction: QuizReaction) => {
      if (reaction.type === "both") {
        if (reaction.text) {
          addMessage("", "bot", { type: "text", text: reaction.text });
        }
        await delay(500);
        if (reaction.memeUrl) {
          addMessage("", "bot", {
            type: "meme",
            memeUrl: reaction.memeUrl,
            memeAlt: reaction.memeAlt,
          });
        }
      } else {
        addMessage("", "bot", reaction);
      }
    },
    [addMessage]
  );

  return {
    isTyping,
    addBotMessages,
    addReaction,
  };
};
