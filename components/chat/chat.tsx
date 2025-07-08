"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
// import { getCurrStep } from "@/libs/stepManager";
// import { QUIZ_STEPPER } from "@/constants/stepConst";

export default function Chat() {
  // const [step, setStep] = useState(QUIZ_STEPPER.WELCOME);

  // useEffect(() => {
  //   const stepData = getCurrStep();
  //   setStep(stepData);
  // }, []);

  return (
    <main className="col-span-1 h-full bg-shadow-primary rounded-lg pl-6 pr-8 py-8 flex flex-col gap-4 overflow-y-auto">
      {/* Message from the other person with profile */}
      <div className="flex items-center gap-2 self-start max-w-[80%]">
        <Image
          src="/images/lovey-stand.svg"
          alt={`lovey-icon`}
          width={52}
          height={52}
        />
        <div className="bg-gray-200 text-black px-4 py-2 rounded-2xl rounded-bl-none shadow">
          Hey! How’s it going?
        </div>
      </div>

      {/* Message from us */}
      <div className="self-end  bg-pink-300 text-white px-4 py-2 rounded-2xl rounded-br-none shadow">
        Pretty good! Just building a chat app 😄
      </div>
    </main>
  );
}

/*
"use client";

import Image from "next/image";
import { ChatMessage } from "@/types/quiz";

export default function ChatMessages({ chat }: { chat: ChatMessage[] }) {
  return (
    <main className="col-span-1 h-full bg-shadow-primary rounded-lg pl-6 pr-8 py-8 flex flex-col gap-4 overflow-y-auto">
      {chat.map((msg) => {
        if (msg.type === "bot") {
          return (
            <div key={msg.id} className="flex gap-2 self-start max-w-[80%]">
              <Image
                src="/images/lovey-stand.svg"
                alt="lovey"
                width={40}
                height={40}
              />
              <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none shadow">
                {msg.message}
              </div>
            </div>
          );
        }
        if (msg.type === "user") {
          return (
            <div
              key={msg.id}
              className="self-end bg-pink-300 text-white px-4 py-2 rounded-2xl rounded-br-none shadow max-w-[80%]"
            >
              {msg.message}
            </div>
          );
        }
        return null;
      })}
    </main>
  );
}

*/
