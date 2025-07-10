"use client";

import { useCallback } from "react";
import { ChatMessage } from "@/types/chat";
import { loadChatHistory } from "@/libs/chatManager";

export const useMessageRecovery = (
  addMessage: (
    message: string,
    type: "bot" | "user",
    reaction?: any
  ) => ChatMessage,
  isMessageInHistory: (messageText: string, history: ChatMessage[]) => boolean
) => {
  const saveExpectedMessages = useCallback(
    (messages: string[], phase: string, context: any) => {
      const expectedMessagesKey = `expected_messages_${phase}`;
      localStorage.setItem(
        expectedMessagesKey,
        JSON.stringify({
          messages,
          phase,
          context,
          timestamp: Date.now(),
        })
      );
    },
    []
  );

  const clearExpectedMessages = useCallback((phase: string) => {
    const expectedMessagesKey = `expected_messages_${phase}`;
    localStorage.removeItem(expectedMessagesKey);
  }, []);

  const recoverExpectedMessages = useCallback(async () => {
    const expectedMessagesKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("expected_messages_")
    );

    for (const key of expectedMessagesKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        const { messages } = data;

        if (messages && messages.length > 0) {
          const currentMessages = loadChatHistory();
          const missingMessages = messages.filter(
            (msg: string) => !isMessageInHistory(msg, currentMessages)
          );

          if (missingMessages.length > 0) {
            for (const message of missingMessages) {
              addMessage(message, "bot");
            }
          }
        }
      } catch (error) {
        console.error("Error recovering expected messages:", error);
      }
      localStorage.removeItem(key);
    }
  }, [addMessage, isMessageInHistory]);

  const recoverFromInterruption = useCallback(async () => {
    await recoverExpectedMessages();

    const checkpointKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("typing_checkpoint_")
    );

    if (checkpointKeys.length > 0) {
      const latestCheckpoint = checkpointKeys
        .map((key) => ({
          key,
          data: JSON.parse(localStorage.getItem(key) || "{}"),
        }))
        .sort((a, b) => b.data.timestamp - a.data.timestamp)[0];

      const { message } = latestCheckpoint.data;
      const currentMessages = loadChatHistory();

      if (!isMessageInHistory(message, currentMessages)) {
        addMessage(message, "bot");
      }

      checkpointKeys.forEach((key) => localStorage.removeItem(key));
    }
  }, [addMessage, isMessageInHistory, recoverExpectedMessages]);

  return {
    saveExpectedMessages,
    clearExpectedMessages,
    recoverFromInterruption,
  };
};
