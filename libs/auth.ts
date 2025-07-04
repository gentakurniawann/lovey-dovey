"use client";

import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Cookie setters
export const setChat = () => {
  Cookies.set("chat", "true", { expires: 7 }); // expires in 7 days
};

export const getChat = (): boolean => {
  return Cookies.get("chat") === "true";
};

export const clearChat = () => {
  Cookies.remove("chat");
};

// Authorization functions (client-side redirect hooks)
export const useRequireAuth = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getChat() && pathname !== "/") {
      router.push("/");
    }
  }, [pathname]);
};

export const useRequireGuest = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (getChat() && pathname !== "/chat") {
      router.push("/chat");
    }
  }, [pathname]);
};
