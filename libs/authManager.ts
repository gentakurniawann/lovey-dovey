"use client";

import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { COOKIE_KEYS } from "@/constants/authConst";

// Cookie for authorization
export const setAuth = () => {
  Cookies.set(COOKIE_KEYS.AUTH, "true", { expires: 7 });
};

export const getAuth = (): boolean => {
  return Cookies.get(COOKIE_KEYS.AUTH) === "true";
};

export const clearSession = () => {
  Cookies.remove(COOKIE_KEYS.AUTH);
  Cookies.remove(COOKIE_KEYS.USERNAME);
};

// Cookie user's crush name
export const setCrushName = (user: string) => {
  Cookies.set(COOKIE_KEYS.USERNAME, user, { expires: 7 });
};

export const getCrushName = (): string => {
  return Cookies.get(COOKIE_KEYS.USERNAME) || "";
};

export const clearCrushName = () => {
  Cookies.remove(COOKIE_KEYS.USERNAME);
};

// Authorization functions (client-side redirect hooks)
export const useRequireAuth = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getAuth() && pathname !== "/") {
      router.push("/");
    }
  }, [pathname]);
};

export const useRequireGuest = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (getAuth() && pathname !== "/chat") {
      router.push("/chat");
    }
  }, [pathname]);
};
