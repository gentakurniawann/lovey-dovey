"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useRequireGuest, setChat } from "@/libs/auth";
import { setCurrentStep } from "@/libs/stepManager";

export default function Home() {
  useRequireGuest();

  // deps
  async function redirectToChat() {
    setCurrentStep(8);
    setChat();
    redirect("/chat");
  }

  return (
    <div className="max-w-[1440px] mx-auto max-h-screen">
      <Image
        src="/images/star-1.png"
        alt="star-1"
        width={216}
        height={216}
        className="absolute max-[956px]:w-[20vw] mt-4 ml-[2.6vw] min-[1120px]:ml-[14.6vw] min-[1400px]:ml-[240px] rotate-[18deg] z-[2] "
      />
      <Image
        src="/images/love-pixel.png"
        alt="love-pixel"
        width={216}
        height={198}
        className="absolute max-[956px]:w-[20vw] mt-6 ml-[76.83vw] min-[1120px]:ml-[70.83vw] min-[1400px]:ml-[1020px] rotate-[18deg] z-[2]"
      />
      <Image
        src="/images/flower-1.png"
        alt="flower-1"
        width={248}
        height={248}
        className="fixed bottom-[-72px] left-[-54px]"
      />
      <div className="mb-[-562px] max-[770px]:mb-[-64vw]">
        <div className="flex flex-col justify-center items-center relative z-[1]">
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
          Hai
        </h1>
        <h1 className="text-[120px] text-pink-300 [text-shadow:14px_4px_0_#f45394] text-center rotate-[-7deg] mt-[-100px] z-[2] relative">
          Ipsum?
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
        className="absolute z-[2] min-[1400px]:ml-[783px] ml-[54.8vw]"
      />
      <Image
        src="/images/paper-2.png"
        alt="paper-2"
        width={348}
        height={320}
        className="fixed bottom-0 right-0"
      />
    </div>
  );
}
