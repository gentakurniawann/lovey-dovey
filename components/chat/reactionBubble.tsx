// import { QuizReaction } from "@/types/chat";

import { QuizReaction } from "@/types/chat";
import Image from "next/image";

export const ReactionBubble = ({ reaction }: { reaction: QuizReaction }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-pink-100 text-pink-900">
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
              <div className="text-pink-900">{reaction.text}</div>
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
