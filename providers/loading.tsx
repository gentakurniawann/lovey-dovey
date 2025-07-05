"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getChat } from "@/libs/auth";
import LoadingAnimation from "@/public/animations/love.json";
import Image from "next/image";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const handleAuth = async () => {
      // Small delay to ensure cookies are ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const hasAuth = getChat();
      const isOnChat = pathname === "/chat";
      const isOnHome = pathname === "/";

      // Handle redirects
      if (hasAuth && isOnHome) {
        router.replace("/chat");
        return;
      }

      if (!hasAuth && isOnChat) {
        router.replace("/");
        return;
      }

      // If we're on the correct page, stop loading
      if ((hasAuth && isOnChat) || (!hasAuth && isOnHome)) {
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [isHydrated, pathname, router]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading ? <GlobalLoadingScreen /> : children}
    </LoadingContext.Provider>
  );
};

const GlobalLoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-pink-100 flex flex-col items-center justify-center z-50">
      <Image src="/images/loader.gif" alt="loading" width={164} height={164} />
      <p className="text-pink-300 font-chango text-2xl">Wait for Us...</p>
    </div>
  );
};
