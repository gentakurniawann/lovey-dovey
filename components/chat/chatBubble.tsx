import Image from "next/image";
import { ChatMessage } from "@/types/chat";

export const ChatBubble = ({
  message,
  isBot,
}: {
  message: ChatMessage;
  isBot: boolean;
}) => {
  // Don't render ChatBubble if message is empty (reaction-only messages)
  if (!message.message || message.message.trim() === "") {
    return null;
  }

  return (
    <div
      className={`flex items-end gap-2 mb-2 md:mb-4 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && (
        <Image
          src="/images/lovey-stand.svg"
          alt="lovey-icon"
          width={40}
          height={40}
          className="self-end"
        />
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-xs md:text-base font-normal ${
          isBot ? "bg-pink-100 text-pink-900" : "bg-pink-500 text-white"
        }`}
      >
        {message.message}
      </div>
    </div>
  );
};
