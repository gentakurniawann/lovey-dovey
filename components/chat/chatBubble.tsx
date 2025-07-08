import { ChatMessage } from "@/types/chat";

export const ChatBubble = ({
  message,
  isBot,
}: {
  message: ChatMessage;
  isBot: boolean;
}) => (
  <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
    <div
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isBot ? "bg-pink-100 text-pink-900" : "bg-pink-500 text-white"
      }`}
    >
      {message.message}
    </div>
  </div>
);
