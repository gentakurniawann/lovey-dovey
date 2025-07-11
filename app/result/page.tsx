"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/global/button";
import { clearSession, useRequireResult } from "@/libs/authManager";
import { useQuizState } from "@/hooks/useQuizState";

export default function ResultPage() {
  useRequireResult();

  const { resetState } = useQuizState();

  const [result, setResult] = useState<{
    crushName: string;
    resultMessages: string[];
    resultType: "high" | "medium" | "low";
  } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("quiz_result");
    if (data) {
      const parsed = JSON.parse(data);
      setResult({
        crushName: parsed.crushName,
        resultMessages: parsed.resultMessages,
        resultType: parsed.resultType,
      });
    }
  }, []);

  if (!result) return null;

  const { resultMessages, resultType } = result!;

  const resultPercentMap = {
    high: "100%",
    medium: "60%",
    low: "20%",
  };

  return (
    <div className="flex flex-row justify-center items-center min-h-screen m-6 lg:m-16 xl:m-0">
      {/* Decorations */}
      <Image
        src="/images/flower-1.png"
        alt="flower-1"
        width={416}
        height={416}
        className="fixed top-[-180px] left-[-120px]"
      />
      <Image
        src="/images/love-target.png"
        alt="love-target"
        width={360}
        height={360}
        className="fixed bottom-[-120px] left-[-24px]"
      />
      <div>
        <div className="p-6 bg-white w-full xl:w-[1140px] rounded-3xl [box-shadow:2px_4px_10_#f45394] relative z-[2]">
          <Image
            src="/images/love-pixel.png"
            alt="love-pixel"
            width={216}
            height={198}
            className="absolute max-[956px]:w-[20vw] mt-[-60px] ml-[62vw] sm:ml-[70vw] xl:ml-[960px] rotate-[18deg] z-[2]"
          />
          <div className="p-6 w-full h-full border border-slate-900 rounded-2xl">
            <div className="flex flex-col xl:flex-row gap-6 md:gap-12 justify-center items-center w-full h-full">
              <Image
                src="/images/result.png"
                alt="result"
                width={465}
                height={416}
              />
              <div className="w-full xl:w-[535px]">
                <h1 className="text-4xl md:text-[80px] text-pink-500 mb-4">
                  Result
                </h1>

                <div className="flex flex-row gap-2 items-center mb-6">
                  {[
                    ...Array(
                      result?.resultType === "high"
                        ? 5
                        : result?.resultType === "medium"
                        ? 3
                        : 1
                    ),
                  ].map((_, i) => (
                    <Image
                      key={i}
                      src="/images/love-pixel.png"
                      alt="love-pixel"
                      width={48}
                      height={40}
                      className="w-[48px] h-[40px] max-sm:w-6 max-sm:h-5"
                    />
                  ))}

                  <span className="font-pixelify text-lg md:text-3xl text-slate-900">
                    {resultPercentMap[resultType]}
                  </span>
                </div>

                <p className="text-sm md:text-base font-normal text-left text-slate-900 mb-6">
                  {resultMessages.map((msg, i) => (
                    <span key={i}>{msg + " "}</span>
                  ))}
                </p>
                <div className="flex flex-col lg:flex-row gap-4">
                  <Button
                    className="font-pixelify w-full md:h-16"
                    onClick={() => {
                      resetState();
                      window.location.href = "/chat";
                    }}
                  >
                    Play Again
                    <Image
                      src="/images/love-pix.svg"
                      alt="love-pix.svg"
                      width={32}
                      height={32}
                      className="max-md:w-6 max-md:h-6"
                    />
                  </Button>
                  <Button
                    className="font-pixelify w-full md:h-16"
                    onClick={() => {
                      resetState();
                      clearSession();
                      window.location.href = "/";
                    }}
                  >
                    Quit
                    <Image
                      src="/images/love-pix.svg"
                      alt="love-pix.svg"
                      width={32}
                      height={32}
                      className="max-md:w-6 max-md:h-6"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
