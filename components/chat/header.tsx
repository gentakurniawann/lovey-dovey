"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getTotalQuiz } from "@/libs/quizManager";
import { DEFAULT_CONFIG } from "@/constants/quizConst";

export default function ChatPage() {
  const [total, setTotal] = useState(DEFAULT_CONFIG.totalQuiz);
  
  useEffect(() => {
    const quizCount = getTotalQuiz();
    setTotal(quizCount);
  }, []);

  return (
    <header className="col-span-2 h-fit flex justify-between rounded-lg p-4 bg-shadow-primary">
      <article className="flex gap-2 items-center">
        <Image
          src="/images/lovey-stand.svg"
          alt="lovey-icon"
          width={64}
          height={64}
        />
        <span className="font-poppins font-extrabold text-pink-500 text-xl">
          Lovey
        </span>
      </article>
      <div className="flex items-center gap-2">
        {[...Array(total)].map((_, index) => (
          <Image
            key={index}
            src="/images/love-pix.svg"
            alt={`love-pixel-${index}`}
            width={36}
            height={36}
          />
        ))}
      </div>
    </header>
  );
}
