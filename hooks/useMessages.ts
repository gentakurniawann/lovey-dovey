"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, QuizReaction } from "@/types/chat";
import { loadChatHistory, saveChatHistory } from "@/libs/chatManager";
import { nanoid } from "nanoid";

export const useMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageIdRef = useRef(0);

  const addMessage = useCallback(
    (message: string, type: "bot" | "user", reaction?: QuizReaction) => {
      const newMessage: ChatMessage = {
        id: `msg_${nanoid()}`,
        type,
        message,
        timestamp: Date.now(),
        reaction: reaction || undefined,
      };

      const currentMessages = loadChatHistory();
      const updatedMessages = [...currentMessages, newMessage];

      saveChatHistory(updatedMessages);
      setMessages(updatedMessages);

      return newMessage;
    },
    []
  );

  const loadMessages = useCallback(() => {
    const savedMessages = loadChatHistory();
    setMessages(savedMessages);
    messageIdRef.current = savedMessages.length;
    return savedMessages;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    saveChatHistory([]);
    messageIdRef.current = 0;
  }, []);

  const isMessageInHistory = useCallback(
    (messageText: string, history: ChatMessage[]): boolean => {
      return history.some(
        (msg) => msg.message === messageText && msg.type === "bot"
      );
    },
    []
  );

  return {
    messages,
    addMessage,
    loadMessages,
    clearMessages,
    isMessageInHistory,
  };
};
