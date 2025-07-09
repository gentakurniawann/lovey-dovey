// import { QuizReaction } from "@/types/chat";

import { QuizReaction } from "@/types/chat";

export const ReactionBubble = ({ reaction }: { reaction: QuizReaction }) => {
  console.log(reaction, "INI REACTION YANG MAU KITA CARIS");
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-pink-100 text-pink-900">
        {reaction.type === "text" && reaction.text}

        {reaction.type === "meme" && (
          <img
            src={reaction.memeUrl}
            alt={reaction.memeAlt || "Reaction meme"}
            className="w-full h-auto rounded-lg"
          />
        )}

        {reaction.type === "both" && (
          <div className="space-y-2">
            {reaction.text && (
              <div className="text-pink-900">{reaction.text}</div>
            )}
            {reaction.memeUrl && (
              <img
                src={reaction.memeUrl}
                alt={reaction.memeAlt || "Reaction meme"}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// export const ReactionBubble = ({ reaction }: { reaction: QuizReaction }) => (
//   <div className="flex justify-start mb-4">
//     <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-pink-100 text-pink-900">
//       {reaction.type === "text" && reaction.text}
//       {reaction.type === "meme" && (
//         <img
//           src={reaction.memeUrl}
//           alt={reaction.memeAlt || "Reaction meme"}
//           className="w-full h-auto rounded-lg"
//         />
//       )}
//       {reaction.type === "both" && (
//         <div>
//           <div className="mb-2">{reaction.text}</div>
//           <img
//             src={reaction.memeUrl}
//             alt={reaction.memeAlt || "Reaction meme"}
//             className="w-full h-auto rounded-lg"
//           />
//         </div>
//       )}
//     </div>
//   </div>
// );
