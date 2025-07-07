"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCrushName, getCrushName, useRequireAuth } from "@/libs/authManager";
import { getCurrentStep } from "@/libs/quizManager";
import WelcomeAnimation from "@/public/animations/welcome.json";
import { RELATIONSHIP_QUIZ, WELCOME } from "@/constants/chatDatasets";
import { REACTIONS_BY_SCORE } from "@/constants/memeDatasets";
import { getRandomQuestions } from "@/utils/getRandomQuestions";
import { getMemeByScore } from "@/utils/getMemeByScore";
import { QuizQuestion } from "@/types/quiz";
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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <main className="col-span-1 h-full bg-shadow-primary rounded-lg pl-6 pr-8 py-8 flex flex-col gap-4 overflow-auto break-words overflow-y-auto">
      {chatStep < WELCOME.length && (
        <div className="flex items-center gap-2 self-start">
          <Image
            src="/images/lovey-stand.svg"
            alt="lovey-icon"
            width={52}
            height={52}
          />
          <div className="bg-gray-200 text-black px-4 py-2 rounded-2xl rounded-bl-none shadow min-h-[56px]">
            {typedMessage || "..."}
          </div>
        </div>
      )}

      {phase === "quiz" &&
        questions.slice(0, currentIndex).map((q, idx) => (
          <React.Fragment key={q.id}>
            <div className="flex items-center gap-2 self-start">
              <Image
                src="/images/lovey-stand.svg"
                alt="lovey-icon"
                width={52}
                height={52}
              />
              <div className="bg-gray-200 text-black px-4 py-2 rounded-2xl rounded-bl-none shadow">
                {q.question}
              </div>
            </div>
            <div className="self-end bg-pink-300 text-white px-4 py-2 rounded-2xl rounded-br-none shadow">
              {q.options[0].text /* Replace with tracked answer */}
            </div>
          </React.Fragment>
        ))}
    </main>
  );
}
