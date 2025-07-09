"use client";
import { setCrushName, useRequireAuth } from "@/libs/authManager";
import Header from "@/components/chat/header";
import Chat from "@/components/chat/chat";
import Interaction from "@/components/chat/interaction";
import { useEffect, useRef, useState } from "react";
import ChatMessages from "@/components/chat/chat";
import z from "zod";
import { saveChatState, loadChatState } from "@/libs/chatManager";
import { ChatMessage, QuizPhase, QuizReaction, QuizState } from "@/types/chat";
import { calculateResult, delay, getRandomReaction } from "@/utils/randomQuest";
import { QUIZ_DATA } from "@/constants/chatConst";
import { OptionButton } from "@/components/chat/optionBubble";
import { Heart, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/chat/chatBubble";
import { TypingIndicator } from "@/components/chat/typingIndicator";
import { ReactionBubble } from "@/components/chat/reactionBubble";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/chat/textInput";
import Image from "next/image";
import dynamic from "next/dynamic";
import WelcomeAnimation from "@/public/animations/welcome.json";

const Player = dynamic(() => import("lottie-react"), { ssr: false });

export default function ChatPage() {
  useRequireAuth();

  const [state, setState] = useState<QuizState>(() => loadChatState());

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<QuizReaction | null>(
    null
  );
  const [username, setUsername] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    saveChatState(state);
  }, [state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // 👇 One-time-only side effects
      if (state.phase === "welcome") {
        initWelcome();
      }
    }
  }, []);

  const updateState = (updates: Partial<QuizState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      saveChatState(newState);
      return newState;
    });
  };

  const addMessage = (message: string, type: "bot" | "user") => {
    const newMessage: ChatMessage = {
      id: `msg_${messageIdRef.current++}`,
      type,
      message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const addBotMessages = async (messages: string[]) => {
    for (const message of messages) {
      setIsTyping(true);
      await delay(500 + Math.random() * 1000);
      setIsTyping(false);
      addMessage(message, "bot");
      await delay(500);
    }
  };

  const initWelcome = async () => {
    await delay(1000);
    await addBotMessages(QUIZ_DATA.botMessages.welcome);
  };

  const handleNameSubmit = async () => {
    if (!inputValue.trim()) return;

    const name = inputValue.trim();
    addMessage(name, "user");
    setInputValue("");

    updateState({ crushName: name, phase: "start_quiz" });

    await delay(1000);
    await addBotMessages(QUIZ_DATA.botMessages.afterName(name));

    await delay(1000);
    startQuiz();
  };

  const startQuiz = async () => {
    updateState({ phase: "questions" });
    await presentQuestion(0);
  };

  const presentQuestion = async (questionIndex: number) => {
    const question = QUIZ_DATA.questions[questionIndex];
    const introMsg = QUIZ_DATA.botMessages.questionIntro(
      questionIndex + 1,
      QUIZ_DATA.questions.length
    );

    await addBotMessages([...introMsg, question.question]);
    setShowOptions(true);
  };

  const handleOptionSelect = async (option: {
    text: string;
    value: number;
  }) => {
    setShowOptions(false);
    addMessage(option.text, "user");

    const newAnswers = [...state.answers, option.value];
    const newScore = state.totalScore + option.value;

    updateState({
      answers: newAnswers,
      totalScore: newScore,
    });

    // Show reaction based on answer value
    await delay(1000);
    setIsTyping(true);
    await delay(1000 + Math.random() * 1000);
    setIsTyping(false);

    const reaction = getRandomReaction(option.value);

    setCurrentReaction(reaction);

    await delay(2000); // Let user see the reaction
    setCurrentReaction(null);

    if (state.currentQuestion < QUIZ_DATA.questions.length - 1) {
      updateState({ currentQuestion: state.currentQuestion + 1 });
      await delay(1000);
      await presentQuestion(state.currentQuestion + 1);
    } else {
      await delay(1000);
      showResults(newScore);
    }
  };

  const showResults = async (finalScore: number) => {
    updateState({ phase: "result" });

    const resultType = calculateResult(finalScore, QUIZ_DATA.questions.length);
    const resultMessages = QUIZ_DATA.botMessages.results[resultType](
      state.crushName
    );

    await addBotMessages(["Calculating your crush compatibility...", "..."]);

    await delay(2000);
    await addBotMessages(resultMessages);
  };

  const resetQuiz = () => {
    const defaultState = {
      phase: "welcome" as QuizPhase,
      currentQuestion: 0,
      answers: [],
      crushName: "",
      totalScore: 0,
      totalQuestions: 8,
    };
    setState(defaultState);
    saveChatState(defaultState);
    setMessages([]);
    setInputValue("");
    setShowOptions(false);
    setCurrentReaction(null);
    messageIdRef.current = 0;

    setTimeout(() => {
      initWelcome();
    }, 500);
  };

  const clearSavedData = () => {
    resetQuiz();
  };

  const renderInput = () => {
    if (state.phase === "welcome" || state.phase === "start_quiz") {
      return (
        <div className="flex flex-col">
          <Player
            autoplay
            loop
            animationData={WelcomeAnimation}
            style={{ height: "360px" }}
          />
          <TextInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleNameSubmit}
            placeholder="Type their name..."
          />
        </div>
      );
    }
    return null;
  };

  const renderOptions = () => {
    if (state.phase === "questions" && showOptions) {
      const currentQuestion = QUIZ_DATA.questions[state.currentQuestion];
      return (
        <div className="mb-4">
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              onClick={() => handleOptionSelect(option)}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  const renderRestartButton = () => {
    if (state.phase === "result") {
      return (
        <div className="space-y-2">
          <button
            onClick={resetQuiz}
            className="w-full p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Start Over</span>
          </button>
          <button
            onClick={clearSavedData}
            className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Clear Saved Data
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:p-[2.5%] grid gap-6 w-screen h-screen grid-rows-[auto_1fr] grid-cols-[2fr_1.2fr]">
      <header className="col-span-2 h-fit flex justify-between rounded-lg p-4 bg-shadow-primary">
        <article className="flex gap-2 items-center">
          <span className="font-chango font-extrabold text-pink-500 text-xl">
            Lovey
          </span>
        </article>
        <div className="flex items-center gap-2">
          {/* {[...Array(total)].map((_, index) => ( */}
          <Image
            src="/images/love-pix.svg"
            alt={`love-pixel`}
            width={36}
            height={36}
          />
          {/* ))} */}
        </div>
      </header>
      <main className="col-span-1 h-full bg-shadow-primary rounded-lg pl-6 pr-8 py-8 flex flex-col gap-4 overflow-y-auto">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isBot={message.type === "bot"}
          />
        ))}

        {isTyping && <TypingIndicator />}
        {currentReaction && <ReactionBubble reaction={currentReaction} />}
        <div ref={messagesEndRef} />
      </main>
      <section className="col-span-1 h-full bg-shadow-primary p-8 rounded-lg overflow-auto break-words">
        {renderOptions()}
        {renderInput()}
        {renderRestartButton()}
      </section>
    </div>
  );
}
