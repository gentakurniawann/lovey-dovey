"use client";

import Image from "next/image";
import { QuizReaction } from "@/types/chat";

export const ReactionBubble = ({ reaction }: { reaction: QuizReaction }) => {
  return (
    <div className="flex items-start gap-2 mb-2 md:mb-4">
      {/* Lovey Icon */}
      <Image
        src="/images/lovey-stand.svg"
        alt="lovey-icon"
        width={40}
        height={40}
        className="self-end"
      />

      {/* Reaction Content */}
      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-pink-100 text-pink-900 text-xs md:text-base">
        {reaction.type === "text" && reaction.text}

        {reaction.type === "meme" && reaction.memeUrl && (
          <Image
            src={reaction.memeUrl}
            alt={reaction.memeAlt || "Reaction meme"}
            width={400}
            height={300}
            className="w-full h-auto rounded-lg"
          />
        )}

        {reaction.type === "both" && (
          <div className="space-y-2">
            {reaction.text && (
              <p className="text-pink-900 text-xs md:text-base">
                {reaction.text}
              </p>
            )}
            {reaction.memeUrl && (
              <Image
                src={reaction.memeUrl}
                alt={reaction.memeAlt || "Reaction meme"}
                width={400}
                height={300}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
