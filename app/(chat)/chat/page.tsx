"use client";
import { setCrushName, useRequireAuth } from "@/libs/authManager";
import { useEffect, useRef, useState } from "react";
import {
  saveChatState,
  loadChatState,
  loadChatHistory,
  saveChatHistory,
} from "@/libs/chatManager";
import {
  ChatMessage,
  PhaseProgress,
  QuizPhase,
  QuizReaction,
  QuizState,
} from "@/types/chat";
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
    // Add a slight delay to ensure ReactionBubble gets rendered
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100); // short enough to wait for ReactionBubble render

    return () => clearTimeout(timeout);
  }, [messages, isTyping]);

  // 🎯 SIMPLE RELOAD LOGIC
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      const savedMessages = loadChatHistory();
      const savedState = loadChatState();

      setState(savedState);
      messageIdRef.current = savedMessages.length;

      // Always restore saved messages first
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }

      // Then determine what to do based on current state
      handleReload(savedState);
    }
  }, []);

  const handleReload = (savedState: QuizState) => {
    const { phase, phaseProgress, currentQuestion, totalScore, crushName } =
      savedState;

    if (phaseProgress === "in_progress") {
      // For in_progress phases, restart from beginning (except questions)
      switch (phase) {
        case "welcome":
          initWelcome();
          break;
        case "start_quiz":
          runPhase("start_quiz", () =>
            QUIZ_DATA.botMessages.afterName(crushName)
          );
          break;
        case "questions":
          // Questions in_progress: continue from current question
          setShowOptions(true);
          break;
        case "result":
          showResults(totalScore);
          break;
        default:
          initWelcome();
          break;
      }
    } else if (phaseProgress === "complete") {
      // For complete phases, move to next step
      switch (phase) {
        case "welcome":
          // Wait for name input (messages already loaded)
          break;
        case "start_quiz":
          setTimeout(() => startQuiz(), 500);
          break;
        case "questions":
          setTimeout(() => showResults(totalScore), 500);
          break;
        case "result":
          // Quiz finished, do nothing
          break;
      }
    } else {
      // not_started or unknown, start fresh
      initWelcome();
    }
  };

  const updateState = (updates: Partial<QuizState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      saveChatState(newState);

      // If phase just completed, save current messages to history
      if (updates.phaseProgress === "complete") {
        setMessages((currentMessages) => {
          saveChatHistory(currentMessages);
          return currentMessages;
        });
      }

      return newState;
    });
  };

  const addMessage = (
    message: string,
    type: "bot" | "user",
    reaction?: QuizReaction
  ) => {
    const newMessage: ChatMessage = {
      id: `msg_${messageIdRef.current++}`,
      type,
      message,
      timestamp: Date.now(),
      reaction: reaction || undefined, // Make sure it's null if no reaction
    };

    console.log(newMessage, "ini new meessage");

    setMessages((prev) => {
      const updated = [...prev, newMessage];

      // Save to history immediately for questions phase and when phase is complete
      if (state.phase === "questions" || state.phaseProgress === "complete") {
        saveChatHistory(updated);
      }

      return updated;
    });

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

  const runPhase = async (
    phase: QuizPhase,
    botMessages: string[] | (() => string[])
  ) => {
    updateState({ phase, phaseProgress: "in_progress" });

    const messages =
      typeof botMessages === "function" ? botMessages() : botMessages;
    await addBotMessages(messages);

    updateState({ phaseProgress: "complete" });
  };

  const initWelcome = () => {
    updateState({ phase: "welcome", phaseProgress: "in_progress" });
    runPhase("welcome", QUIZ_DATA.botMessages.welcome);
  };

  const handleNameSubmit = async () => {
    if (!inputValue.trim()) return;

    const name = inputValue.trim();
    addMessage(name, "user");
    setInputValue("");

    updateState({ crushName: name });
    await runPhase("start_quiz", () => QUIZ_DATA.botMessages.afterName(name));

    await delay(1000);
    startQuiz();
  };

  const startQuiz = async () => {
    updateState({ phase: "questions", phaseProgress: "in_progress" });
    await presentQuestion(state.currentQuestion || 0);
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
    const nextQuestion = state.currentQuestion + 1;

    updateState({
      answers: newAnswers,
      totalScore: newScore,
      currentQuestion: nextQuestion,
    });

    await delay(1000);
    setIsTyping(true);
    await delay(1000 + Math.random() * 1000);
    setIsTyping(false);

    const reaction = getRandomReaction(option.value);
    await addReaction(reaction);

    // Add delay for pacing
    await delay(2000);

    const isLastQuestion = nextQuestion >= QUIZ_DATA.questions.length;

    if (!isLastQuestion) {
      await delay(1000);
      await presentQuestion(nextQuestion);
    } else {
      updateState({ phaseProgress: "complete" });
      await delay(1000);
      showResults(newScore);
    }
  };

  const addReaction = async (reaction: {
    type: "text" | "meme" | "both";
    text?: string;
    memeUrl?: string;
    memeAlt?: string;
  }) => {
    if (reaction.type === "both") {
      // First, add the text reaction
      if (reaction.text) {
        addMessage("", "bot", {
          type: "text",
          text: reaction.text,
        });
      }

      await delay(500); // slight gap between text and meme

      // Then add the meme reaction
      if (reaction.memeUrl) {
        addMessage("", "bot", {
          type: "meme",
          memeUrl: reaction.memeUrl,
          memeAlt: reaction.memeAlt,
        });
      }
    } else {
      // For single type reactions, just pass the reaction as-is
      addMessage("", "bot", reaction);
    }
  };

  const showResults = async (finalScore: number) => {
    updateState({ phase: "result", phaseProgress: "in_progress" });

    const resultType = calculateResult(finalScore, QUIZ_DATA.questions.length);
    const resultMessages = QUIZ_DATA.botMessages.results[resultType](
      state.crushName
    );

    await addBotMessages(["Calculating your crush compatibility...", "..."]);
    await delay(2000);
    await addBotMessages(resultMessages);

    updateState({ phaseProgress: "complete" });
  };

  const resetQuiz = () => {
    const defaultState: QuizState = {
      phase: "welcome",
      phaseProgress: "not_started",
      currentQuestion: 0,
      answers: [],
      crushName: "",
      totalScore: 0,
      totalQuestions: 8,
    };

    setState(defaultState);
    saveChatState(defaultState);
    setMessages([]);
    saveChatHistory([]);
    setInputValue("");
    setShowOptions(false);
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

  // Components
  const renderOptions = () => {
    if (state.phase === "questions" && showOptions) {
      const currentQuestion = QUIZ_DATA.questions[state.currentQuestion];
      return (
        <div className="mb-4">
          {currentQuestion?.options?.map((option, index) => (
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
          <div key={message.id}>
            <ChatBubble message={message} isBot={message.type === "bot"} />
            {/* Render ReactionBubble if this message has a reaction */}
            {message.reaction && <ReactionBubble reaction={message.reaction} />}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        {/* Remove this line: {currentReaction && <ReactionBubble reaction={currentReaction} />} */}
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
