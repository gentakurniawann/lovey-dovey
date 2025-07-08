"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequireAuth } from "@/libs/authManager";
import WelcomeAnimation from "@/public/animations/welcome.json";
// import { QuizQuestion } from "@/types/quiz";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Player = dynamic(() => import("lottie-react"), { ssr: false });

const FormSchema = z.object({
  crushName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export default function ChatPage() {
  useRequireAuth();

  const [step, setStep] = useState(8);
  const [phase, setPhase] = useState<"welcome" | "quiz" | "done">("welcome");
  const [chatStep, setChatStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { crushName: "" },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setUsername(data.crushName);
    setTimeout(() => {
      setChatStep(1);
      setTyping(true);
    }, 500);
  };

  const handleAnswer = (value: number) => {
    setScore((prev) => prev + value);
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      setPhase("done");
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <section className="col-span-1 h-full bg-shadow-primary rounded-lg overflow-auto break-words">
      {!username ? (
        <div className="items-center flex flex-col gap-2">
          <Player
            autoplay
            loop
            animationData={WelcomeAnimation}
            style={{ height: "360px" }}
          />
          <span className="font-chango -mt-12 leading-8 mb-6 text-pink-400 text-[1.6rem] text-center">
            Olaa! anyway so, <br /> who's your crush name?
          </span>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 px-8"
            >
              <FormField
                control={form.control}
                name="crushName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Type their name here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="items-center flex flex-col gap-6 p-8 text-center">
          {!isFinished ? (
            <>
            </>
          ) : (
            <>
              <h2 className="font-chango text-2xl text-pink-400">Your Vibe:</h2>
              {/* <Image
                src={getMemeByScore(score, REACTIONS_BY_SCORE)}
                alt="Meme reaction"
                width={300}
                height={300}
                className="rounded-xl shadow"
              /> */}
              <p className="text-gray-400 text-sm">Score: {score}</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

// "use client"

// import Image from "next/image";
// import React from "react";
// import dynamic from "next/dynamic";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { QuizQuestion } from "@/types/quiz";
// import WelcomeAnimation from "@/public/animations/welcome.json";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// const Player = dynamic(() => import("lottie-react"), { ssr: false });

// const FormSchema = z.object({
//   crushName: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
// });

// type Props = {
//   phase: "welcome" | "quiz" | "done";
//   currentQuestion?: QuizQuestion;
//   onSubmitName: (name: string) => void;
//   onAnswer: (value: number, text: string) => void;
// };

// export default function ChatInput({
//   phase,
//   currentQuestion,
//   onSubmitName,
//   onAnswer,
// }: Props) {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: { crushName: "" },
//   });

//   if (phase === "welcome") {
//     return (
//       <section className="col-span-1 h-full bg-shadow-primary rounded-lg overflow-auto break-words">
//         <div className="items-center flex flex-col gap-2">
//           <Player
//             autoplay
//             loop
//             animationData={WelcomeAnimation}
//             style={{ height: "360px" }}
//           />
//           <span className="font-chango -mt-12 leading-8 mb-6 text-pink-400 text-[1.6rem] text-center">
//             Olaa! anyway so, <br /> who's your crush name?
//           </span>
//           <form
//             onSubmit={form.handleSubmit((data) => onSubmitName(data.crushName))}
//             className="flex gap-2 px-6 py-4"
//           >
//             <Input
//               {...form.register("crushName")}
//               placeholder="Type their name..."
//             />
//             <Button type="submit">Send</Button>
//           </form>
//         </div>
//       </section>
//     );
//   }

//   if (phase === "quiz" && currentQuestion) {
//     return (
//       <section className="col-span-1 bg-shadow-primary rounded-lg p-6">
//         <div className="flex flex-col gap-4">
//           {currentQuestion.options.map((opt, idx) => (
//             <Button
//               key={idx}
//               onClick={() => onAnswer(opt.value, opt.text)}
//               className="bg-pink-300 text-white hover:bg-pink-400"
//             >
//               {opt.text}
//             </Button>
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (phase === "done") {
//     return (
//       <section className="text-center text-gray-400 py-6 text-sm">
//         ✨ Done! Thanks for playing.
//       </section>
//     );
//   }

//   return null;
// }
