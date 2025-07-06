"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCrushName, getCrushName } from "@/libs/auth";

import { useRequireAuth } from "@/libs/auth";
import { getCurrentStep } from "@/libs/stepManager";
import WelcomeAnimation from "@/public/animations/welcome.json";
import { RELATIONSHIP_QUIZ } from "@/constants/chatDatasets";
import { INTERACTION_FLOW } from "@/constants/flow";
import { REACTIONS_BY_SCORE } from "@/constants/memeDatasets";
import { getRandomQuestions } from "@/utils/getRandomQuestions";
import { getMemeByScore } from "@/utils/getMemeByScore";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Player = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const FormSchema = z.object({
  crushName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});


export default function ChatPage() {
  useRequireAuth();

  const [step, setStep] = useState(8);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const name = getCrushName();
    if (name) {
      setUsername(name);
    }
  }, []);

  useEffect(() => {
    setStep(getCurrentStep());
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      crushName: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setCrushName(data.crushName);
    setUsername(data.crushName);
  }

  

  return (
    <div className="lg:p-[2.5%] grid gap-6 w-screen h-screen grid-rows-[auto_1fr] grid-cols-[2fr_1.2fr]">
      {/* Header chat */}
      <header className="col-span-2 h-fit flex justify-between rounded-lg p-4 bg-shadow-primary">
        <article className="flex gap-2 items-center">
          <Image
            src="/images/lovey-stand.svg"
            alt={`lovey-icon`}
            width={64}
            height={64}
          />
          <span className="font-poppins font-extrabold text-pink-500 text-xl">
            Lovey
          </span>
        </article>
        <div className="flex items-center gap-2">
          {[...Array(step)].map((_, index) => (
            <Image
              key={index}
              src="/images/love-pix.svg"
              alt={`love-pixel-${index}`}
              width={36}
              height={36}
            />
          ))}{" "}
        </div>
      </header>
      {/* Display user's answer  */}
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

      <section className="col-span-1 h-full bg-shadow-primary rounded-lg ">
        {/* User's pick */}
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
                        <Input
                          placeholder="Type their name here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="items-center flex flex-col gap-2">

          </div>
        )}
      </section>
    </div>
  );
}
