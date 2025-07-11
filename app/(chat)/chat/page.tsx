"use client";

import { OptionButton } from "@/components/chat/optionBubble";
import { usePreventReload } from "@/components/chat/preventLoading";
import { TextInput } from "@/components/chat/textInput";
import {
  PHASE_CONFIG,
  QUIZ_DATA,
  QUIZ_INIT_STATE,
} from "@/constants/chatConst";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBotMessages } from "@/hooks/useBotMessages";
import { useMessageRecovery } from "@/hooks/useMessageRecovery";
import { useMessages } from "@/hooks/useMessages";
import { useQuizFlow } from "@/hooks/useQuizFlow";
import { useQuizInitialization } from "@/hooks/useQuizInitialization";
import { useQuizState } from "@/hooks/useQuizState";
import { useRequireAuth } from "@/libs/authManager";
import { calculateResult, delay } from "@/utils/randomQuest";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import WaitingAnimation from "@/public/animations/waiting.json";
import WelcomeAnimation from "@/public/animations/welcome.json";
import { ChatBubble } from "@/components/chat/chatBubble";
import { TypingIndicator } from "@/components/chat/typingIndicator";
import { ReactionBubble } from "@/components/chat/reactionBubble";
import { CalculatingModal } from "@/components/chat/calcResult";

const Player = dynamic(() => import("lottie-react"), { ssr: false });

export default function ChatPage() {
  useRequireAuth();

  const {
    state,
    updateState,
    randomizedQuestions,
    initializeRandomizedQuestions,
    getCurrentQuestion,
  } = useQuizState();

  const { messages, addMessage, loadMessages, isMessageInHistory } =
    useMessages();
  const {
    saveExpectedMessages,
    clearExpectedMessages,
    recoverFromInterruption,
  } = useMessageRecovery(addMessage, isMessageInHistory);
  const { isTyping, addBotMessages, addReaction } = useBotMessages(
    addMessage,
    isMessageInHistory
  );

  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const endOptionInputRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const shouldBlockReload =
    (state.phase === "start_quiz" || state.phase === "questions") &&
    state.phaseProgress === "in_progress";
  usePreventReload(shouldBlockReload);

  const showResults = useCallback(
    async (finalScore: number) => {
      updateState({ phase: "result", phaseProgress: "in_progress" });
      setIsCalculating(true);
      await delay(2000); // Simulate a delay for the calculation

      const resultType = calculateResult(
        finalScore,
        QUIZ_INIT_STATE.totalQuestions
      );
      const resultMessages = QUIZ_DATA.botMessages.results[resultType](
        state.crushName
      );

      localStorage.setItem(
        "quiz_result",
        JSON.stringify({
          crushName: state.crushName,
          resultMessages,
          finalScore,
          resultType,
        })
      );

      updateState({ phaseProgress: "complete" });
      setIsCalculating(false);
      redirect("/result");
    },
    [updateState, state.crushName]
  );

  const initWelcome = useCallback(async () => {
    updateState({ phase: "welcome", phaseProgress: "in_progress" });

    const welcomeMessages = PHASE_CONFIG.welcome.initialBotMessages(
      state.crushName
    );
    saveExpectedMessages(welcomeMessages, "welcome", {
      crushName: state.crushName,
    });

    const currentMessages = loadMessages();
    await addBotMessages(welcomeMessages, currentMessages);
    clearExpectedMessages("welcome");

    updateState({ phaseProgress: "complete" });
  }, [
    updateState,
    addBotMessages,
    state.crushName,
    saveExpectedMessages,
    clearExpectedMessages,
    loadMessages,
  ]);

  const { startQuiz, handleOptionSelect } = useQuizFlow(
    state,
    updateState,
    addBotMessages,
    addReaction,
    addMessage,
    saveExpectedMessages,
    clearExpectedMessages,
    loadMessages,
    showResults,
    randomizedQuestions, // Add this
    initializeRandomizedQuestions // Add this
  );

  useQuizInitialization(
    state,
    updateState,
    loadMessages,
    recoverFromInterruption,
    addBotMessages,
    isMessageInHistory,
    startQuiz,
    showResults,
    initWelcome
  );

  const handleNameSubmit = async () => {
    if (!inputValue.trim()) return;

    const name = inputValue.trim();
    addMessage(name, "user");
    setInputValue("");
    updateState({ crushName: name });

    const startQuizMessages = PHASE_CONFIG.start_quiz.initialBotMessages(name);
    saveExpectedMessages(startQuizMessages, "start_quiz", { name });

    const currentMessages = loadMessages();
    await addBotMessages(startQuizMessages, currentMessages);
    clearExpectedMessages("start_quiz");

    updateState({ phase: "start_quiz", phaseProgress: "complete" });
    setTimeout(() => startQuiz(), 100);
  };

  useEffect(() => {
    const recoverPendingMessages = async () => {
      const raw = localStorage.getItem("pending_bot_messages");
      const pending: string[] = raw ? JSON.parse(raw) : [];

      if (pending.length > 0) {
        const currentMessages = loadMessages(); // or from context/state
        await addBotMessages(pending, currentMessages, true); // or false for instant
      }
    };

    recoverPendingMessages();
  }, [addBotMessages]);

  // Auto-scroll effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping]);

  useEffect(() => {
    if (showOptions) {
      if (isMobile) {
        const timeout = setTimeout(() => {
          endOptionInputRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [showOptions]);

  // Properly manage showOptions state based on quiz state
  useEffect(() => {
    if (state.phase === "questions" && state.phaseProgress === "in_progress") {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, [state.phase, state.phaseProgress]);

  // Hide options when typing to prevent showing options during bot responses
  useEffect(() => {
    if (isTyping && state.phase === "questions") {
      setShowOptions(false);
    }
  }, [isTyping, state.phase]);

  // Hide options when there are reactions being added
  useEffect(() => {
    const hasRecentReaction = messages.some((message) => message.reaction);
    if (hasRecentReaction && state.phase === "questions") {
      setShowOptions(false);
    }
  }, [messages, state.phase]);

  // Show options again after typing is done (with a small delay to ensure smooth UX)
  useEffect(() => {
    if (
      !isTyping &&
      state.phase === "questions" &&
      state.phaseProgress === "in_progress"
    ) {
      const timeout = setTimeout(() => {
        setShowOptions(true);
      }, 500); // Small delay to let the bot message appear first
      return () => clearTimeout(timeout);
    }
  }, [isTyping, state.phase, state.phaseProgress]);

  // Render functions (keep the same)
  const renderInput = () => {
    if (state.phase === "welcome" || state.phase === "start_quiz") {
      return (
        <div className="flex flex-col justify-between items-center h-full">
          {!isMobile && (
            <div className="overflow-auto h-full mb-2">
              <Player
                autoplay
                loop
                animationData={WelcomeAnimation}
                style={{ height: "360px" }}
              />
            </div>
          )}
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
      const currentQuestion = getCurrentQuestion();

      if (!currentQuestion?.options) return null;

      return (
        <div className="mb-2 md:mb-4">
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

  return (
    <div className="p-[2.5%] w-screen max-md:min-h-screen max-md:h-full h-full">
      <header className="h-fit flex justify-between rounded-lg px-4 py-2 md:p-4 bg-shadow-primary mb-4 md:mb-6 w-full">
        <article className="flex gap-2 items-center">
          <span className="font-chango font-extrabold text-pink-500 text-xl">
            Lovey
          </span>
        </article>
        <div className="flex items-center gap-1 md:gap-2">
          <Image
            src="/images/love-pix.svg"
            alt={`love-pixel`}
            width={36}
            height={36}
            className="max-md:w-5"
          />
          <Image
            src="/images/love-pix.svg"
            alt={`love-pixel`}
            width={36}
            height={36}
            className="max-md:w-5"
          />
          <Image
            src="/images/love-pix.svg"
            alt={`love-pixel`}
            width={36}
            height={36}
            className="max-md:w-5"
          />
        </div>
      </header>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-y-6 md:gap-x-6 md:h-[calc(100vh-9rem)]">
        <main
          className={`col-span-2 max-md:h-[calc(100vh-5rem)] bg-shadow-primary rounded-lg px-2.5 py-2.5 md:px-6 md:py-6 flex flex-col justify-between gap-2 w-full md:overflow-y-auto`}
        >
          <div
            className={`overflow-y-auto w-full h-full ${
              isMobile && "max-h-full"
            }`}
          >
            {messages.map((message) => (
              <div key={message.id}>
                <ChatBubble message={message} isBot={message.type === "bot"} />
                {message.reaction && (
                  <ReactionBubble reaction={message.reaction} />
                )}
              </div>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          {isMobile && (
            <div className="h-fit">
              {renderOptions()}
              {renderInput()}
              <div ref={endOptionInputRef} />
            </div>
          )}
        </main>
        <CalculatingModal isOpen={isCalculating} />
        {!isMobile && (
          <section className="col-span-1 h-full bg-shadow-primary p-8 rounded-lg overflow-auto break-words w-full">
            {renderOptions()}
            {renderInput()}
            {state.phase === "questions" && !showOptions && (
              <Player
                autoplay
                loop
                animationData={WaitingAnimation}
                style={{ height: "360px" }}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
