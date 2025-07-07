"use client";
import { useRequireAuth } from "@/libs/authManager";
import Chat from "@/components/chat/chat";
import Header from "@/components/chat/header";
import Interaction from "@/components/chat/interaction";

export default function ChatPage() {
  useRequireAuth();
  return (
    <div className="lg:p-[2.5%] grid w-screen h-screen grid-rows-[auto_1fr] grid-cols-[1fr_0.6fr] gap-6 overflow-hidden">
      <Header />
      <Chat />
      <Interaction />
    </div>
  );
}
