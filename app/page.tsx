"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useRequireGuest, setAuth } from "@/libs/authManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { saveChatState } from "@/libs/chatManager";

export default function Home() {
  // variables
  const isMobile = useIsMobile();

  useRequireGuest();

  // deps
  async function redirectToChat() {
    setAuth();
    saveChatState({
      phase: "welcome",
      totalQuestions: 8,
      currentQuestion: 0,
      answers: [],
      crushName: "",
      totalScore: 0,
    });
    redirect("/chat");
  }

  return (
    <>
      {!isMobile && (
        <div className="flex flex-row justify-center items-center h-screen">
          <div>
            <Image
              src="/images/star-1.png"
              alt="star-1"
              width={216}
              height={216}
              className="absolute max-[956px]:w-[20vw] mt-[-120px] rotate-[18deg] z-[2] "
            />
            <Image
              src="/images/love-pixel.png"
              alt="love-pixel"
              width={216}
              height={198}
              className="absolute max-[956px]:w-[20vw] mt-[-120px] ml-[680px] rotate-[18deg] z-[2]"
            />
            <Image
              src="/images/flower-1.png"
              alt="flower-1"
              width={248}
              height={248}
              className="fixed bottom-[-72px] left-[-54px]"
            />
            <div className="mb-[-562px] max-[770px]:mb-[-64vw]">
              <div className="flex flex-col justify-center items-center relative z-[1] mt-[-132px]">
                <Image
                  src="/images/paper-1.png"
                  alt="paper-1"
                  width={880}
                  height={320}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center relative z-[2]">
              <Image
                src="/images/star-2.png"
                alt="star-2"
                width={560}
                height={320}
                className="mb-[-360px] max-[770]:w-[64vw] max-[770]:mb-[-44vw]"
              />
              <h1 className="text-[100px] text-pink-300 [text-shadow:14px_4px_0_#f45394] text-center rotate-[-7deg] z-[2] relative">
                Into
              </h1>
              <h1 className="text-[120px] text-pink-300 [text-shadow:14px_4px_0_#f45394] text-center rotate-[-7deg]  -mt-[75px] z-[2] relative">
                You?
              </h1>
              <button
                className="w-40 bg-pink-500 shadow-pink-300 shadow h-16 rounded-full hover:bg-pink-600 hover:scale-105 duration-100 cursor-pointer"
                onClick={redirectToChat}
              ></button>
            </div>
            <Image
              src="/images/pointer.png"
              alt="pointer"
              width={104}
              height={136}
              className="absolute z-[2] ml-[480px]"
            />
            <Image
              src="/images/paper-2.png"
              alt="paper-2"
              width={348}
              height={320}
              className="fixed bottom-0 right-0"
            />
          </div>
        </div>
      )}

      {isMobile && (
        <div className="flex flex-row justify-center items-center h-screen">
          <div>
            <Image
              src="/images/star-1.png"
              alt="star-1"
              width={160}
              height={160}
              className="fixed top-[-60px] left-[-72px] rotate-[18deg]"
            />
            <Image
              src="/images/love-pixel.png"
              alt="love-pixel"
              width={106}
              height={80}
              className="absolute mt-[-120px] ml-[182px] rotate-[18deg] z-[2]"
            />
            <Image
              src="/images/flower-1.png"
              alt="flower-1"
              width={156}
              height={156}
              className="fixed bottom-[-56px] left-[-56px]"
            />
            <div className="flex flex-col justify-center items-center relative z-[1] mt-[-120px]">
              <Image
                src="/images/paper-mobile.png"
                alt="paper-mobile"
                width={282}
                height={350}
              />
            </div>
            <div className="flex flex-col justify-center items-center relative z-[2] mt-[-256px]">
              <Image
                src="/images/star-2.png"
                alt="star-2"
                width={180}
                height={100}
                className="mb-[-120px]"
              />
              <h1 className="text-4xl text-pink-300 [text-shadow:2px_4px_0_#f45394] text-center rotate-[-7deg] z-[2] relative">
                Hai
              </h1>
              <h1 className="text-[40px] text-pink-300 [text-shadow:2px_4px_0_#f45394] text-center rotate-[-7deg] mt-[-24px] z-[2] relative mb-6">
                Ipsum?
              </h1>
              <button
                className="w-24 bg-pink-500 shadow-pink-300 shadow h-10 rounded-full hover:bg-pink-600 hover:scale-105 duration-100 cursor-pointer"
                onClick={redirectToChat}
              ></button>
            </div>
            <Image
              src="/images/pointer.png"
              alt="pointer"
              width={52}
              height={78}
              className="absolute z-[2] ml-[180px]"
            />
            <Image
              src="/images/paper-2.png"
              alt="paper-2"
              width={200}
              height={225}
              className="fixed bottom-0 right-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
