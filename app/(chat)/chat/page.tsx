"use client";
import { useRequireAuth } from "@/libs/authManager";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  saveChatState,
  loadChatState,
  loadChatHistory,
  saveChatHistory,
} from "@/libs/chatManager";
import { ChatMessage, QuizPhase, QuizReaction, QuizState } from "@/types/chat";
import { calculateResult, delay, getRandomReaction } from "@/utils/randomQuest";
import { QUIZ_DATA, PHASE_CONFIG } from "@/constants/chatConst";
import { OptionButton } from "@/components/chat/optionBubble";
import { RotateCcw } from "lucide-react";
import { ChatBubble } from "@/components/chat/chatBubble";
import { TypingIndicator } from "@/components/chat/typingIndicator";
import { ReactionBubble } from "@/components/chat/reactionBubble";
import { TextInput } from "@/components/chat/textInput";
import Image from "next/image";
import dynamic from "next/dynamic";
import WelcomeAnimation from "@/public/animations/welcome.json";

// Dynamic import for Lottie Player, ensuring it's only loaded on the client side
const Player = dynamic(() => import("lottie-react"), { ssr: false });

export default function ChatPage() {
  // Custom hook for authentication (assuming it redirects if not authenticated)
  useRequireAuth();

  // State management for the quiz flow and chat messages
  const [state, setState] = useState<QuizState>(() => loadChatState());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Refs for scrolling and message ID generation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const hasInitializedRef = useRef(false); // Flag to ensure initial load logic runs only once

  // Effect to persist quiz state to local storage whenever it changes
  useEffect(() => {
    saveChatState(state);
  }, [state]);

  // Callback to scroll to the bottom of the chat, memoized for performance
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Effect to auto-scroll to the bottom whenever messages or typing status changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping, scrollToBottom]);

  // Helper function to update the quiz state and immediately save it
  // Memoized using useCallback to prevent unnecessary re-renders
  const updateState = useCallback((updates: Partial<QuizState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      saveChatState(newState); // Save immediately to local storage
      return newState;
    });
  }, []);

  // Helper function to check if a bot message is already present in the current messages array
  // This is crucial for preventing duplication on reload
  const isMessageAlreadyInHistory = useCallback(
    (messageText: string, history: ChatMessage[]): boolean => {
      return history.some(
        (msg) => msg.message === messageText && msg.type === "bot"
      );
    },
    []
  );

  // Unified function to add a message (bot or user) to the chat
  // It immediately saves the entire chat history after adding a message
  const addMessage = useCallback(
    (message: string, type: "bot" | "user", reaction?: QuizReaction) => {
      const newMessage: ChatMessage = {
        id: `msg_${messageIdRef.current++}`,
        type,
        message,
        timestamp: Date.now(),
        reaction: reaction || undefined,
      };

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        saveChatHistory(updated); // CRUCIAL: Save history IMMEDIATELY after adding any message
        return updated;
      });
      return newMessage;
    },
    []
  ); // No dependencies for addMessage itself, it operates on a new message

  // Function to simulate bot typing and add a sequence of messages
  // It now takes `existingMessages` to prevent re-adding already displayed messages
  const addBotMessages = async (
    messagesToAdd: string[],
    existingMessages: ChatMessage[] = []
  ) => {
    for (const message of messagesToAdd) {
      if (!isMessageAlreadyInHistory(message, existingMessages)) {
        setIsTyping(true);
        await delay(500 + Math.random() * 1000);
        setIsTyping(false);
        addMessage(message, "bot");
        await delay(500);
      } else {
        // If the message is already in history, skip adding it to prevent duplication.
        // console.log(`Skipping already existing message: "${message}"`);
      }
    }
  };

  // --- Phase Transition Functions ---
  // These functions encapsulate the logic for starting each major phase of the quiz.

  // Presents a specific question to the user
  // Declared BEFORE startQuiz as it's a dependency
  const presentQuestion = useCallback(
    async (questionIndex: number) => {
      const question = QUIZ_DATA.questions[questionIndex];
      const introMsg = QUIZ_DATA.botMessages.questionIntro(
        questionIndex + 1,
        QUIZ_DATA.questions.length
      );
      // Pass current messages to addBotMessages to prevent duplication on reload
      await addBotMessages([...introMsg, question.question], messages);
      setShowOptions(true);
    },
    [addBotMessages, messages]
  );

  // Starts the quiz, transitioning to the questions phase
  const startQuiz = useCallback(async () => {
    updateState({ phase: "questions", phaseProgress: "in_progress" });
    await presentQuestion(state.currentQuestion || 0);
  }, [updateState, state.currentQuestion, presentQuestion]);

  // Initializes the welcome phase, sends welcome messages, and marks phase complete
  const initWelcome = useCallback(async () => {
    updateState({ phase: "welcome", phaseProgress: "in_progress" });
    // Pass current messages to addBotMessages to prevent duplication on reload
    await addBotMessages(
      PHASE_CONFIG.welcome.initialBotMessages(state.crushName),
      messages
    );
    updateState({ phaseProgress: "complete" });
  }, [updateState, addBotMessages, state.crushName, messages]);

  // Adds a reaction bubble message (text, meme, or both)
  const addReaction = useCallback(
    async (reaction: QuizReaction) => {
      if (reaction.type === "both") {
        if (reaction.text) {
          addMessage("", "bot", { type: "text", text: reaction.text });
        }
        await delay(500);
        if (reaction.memeUrl) {
          addMessage("", "bot", {
            type: "meme",
            memeUrl: reaction.memeUrl,
            memeAlt: reaction.memeAlt,
          });
        }
      } else {
        addMessage("", "bot", reaction);
      }
    },
    [addMessage]
  );

  // Displays the final quiz results based on the total score
  const showResults = useCallback(
    async (finalScore: number) => {
      updateState({ phase: "result", phaseProgress: "in_progress" });

      // Send initial calculating messages for the result phase
      // Pass current messages to addBotMessages to prevent duplication on reload
      await addBotMessages(
        PHASE_CONFIG.result.initialBotMessages(state.crushName),
        messages
      );
      await delay(2000);

      const resultType = calculateResult(
        finalScore,
        QUIZ_DATA.questions.length
      );
      const resultMessages = QUIZ_DATA.botMessages.results[resultType](
        state.crushName
      );
      // Send dynamic result messages
      // Pass current messages to addBotMessages to prevent duplication on reload
      await addBotMessages(resultMessages, messages);

      updateState({ phaseProgress: "complete" });
    },
    [updateState, addBotMessages, state.crushName, messages]
  );

  // --- User Interaction Handlers ---

  // Handles the submission of the crush's name
  const handleNameSubmit = async () => {
    if (!inputValue.trim()) return;

    const name = inputValue.trim();
    addMessage(name, "user"); // Add user's name message
    setInputValue("");

    updateState({ crushName: name });
    // Send "after name" messages from PHASE_CONFIG
    // Pass current messages to addBotMessages to prevent duplication on reload
    await addBotMessages(
      PHASE_CONFIG.start_quiz.initialBotMessages(name),
      messages
    );
    updateState({ phase: "start_quiz", phaseProgress: "complete" }); // Mark start_quiz phase as complete

    // Trigger the next action defined in PHASE_CONFIG for start_quiz completion
    PHASE_CONFIG.start_quiz.onComplete(
      startQuiz,
      showResults,
      name,
      state.currentQuestion,
      state.totalScore,
      QUIZ_DATA.questions.length
    );
  };

  // Handles the selection of an option during the questions phase
  const handleOptionSelect = async (option: {
    text: string;
    value: number;
  }) => {
    setShowOptions(false);
    addMessage(option.text, "user"); // Add user's selected option message

    const newAnswers = [...state.answers, option.value];
    const newScore = state.totalScore + option.value;
    const nextQuestion = state.currentQuestion + 1;

    updateState({
      answers: newAnswers,
      totalScore: newScore,
      currentQuestion: nextQuestion,
      // Phase remains 'questions' and progress 'in_progress' until quiz complete
    });

    await delay(500);
    setIsTyping(true);
    await delay(500 + Math.random() * 1000);
    setIsTyping(false);

    const reaction = getRandomReaction(option.value);
    await addReaction(reaction); // Add bot's reaction to the answer

    await delay(2000); // Pacing delay

    const isLastQuestion = nextQuestion >= QUIZ_DATA.questions.length;

    if (!isLastQuestion) {
      await delay(500);
      await presentQuestion(nextQuestion); // Present the next question
    } else {
      updateState({ phaseProgress: "complete" }); // Questions phase is now complete
      // Trigger the next action defined in PHASE_CONFIG for questions completion
      PHASE_CONFIG.questions.onComplete(
        startQuiz,
        showResults,
        state.crushName,
        state.currentQuestion,
        newScore,
        QUIZ_DATA.questions.length
      );
    }
  };

  // Resets the quiz to its initial state
  const resetQuiz = useCallback(() => {
    const defaultState: QuizState = {
      phase: "welcome",
      phaseProgress: "not_started",
      currentQuestion: 0,
      answers: [],
      crushName: "",
      totalScore: 0,
      totalQuestions: QUIZ_DATA.questions.length, // Ensure totalQuestions is accurate
    };

    setState(defaultState);
    saveChatState(defaultState); // Clear saved state in local storage
    setMessages([]); // Clear messages in UI
    saveChatHistory([]); // Clear saved history in local storage
    setInputValue("");
    setShowOptions(false);
    messageIdRef.current = 0; // Reset message ID counter

    // Immediately start the welcome sequence after reset
    setTimeout(() => {
      initWelcome();
    }, 100);
  }, [initWelcome]);

  // Clears all saved data and resets the quiz
  const clearSavedData = useCallback(() => {
    resetQuiz();
  }, [resetQuiz]);

  // --- Initial Load and Reload Logic ---
  // This useEffect handles loading saved state and resuming the chat flow.
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true; // Mark as initialized

      const savedMessages = loadChatHistory(); // Load all saved messages
      const savedState = loadChatState(); // Load saved quiz state

      setState(savedState); // Restore state
      messageIdRef.current = savedMessages.length; // Ensure new messages get unique IDs

      // Always restore saved messages first, this is the visual truth of the chat
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }

      // Now, determine what action to take based on the saved state.
      // The goal is NOT to re-add messages that are already loaded,
      // but to trigger the *next* logical step or to set the UI to await user input.
      const { phase, phaseProgress, currentQuestion, totalScore, crushName } =
        savedState;

      if (phaseProgress === "complete") {
        // If a phase was marked complete, it means its initial messages were sent.
        // We now move to the *next* logical phase's action as defined in PHASE_CONFIG.
        const config = PHASE_CONFIG[phase];
        if (config && config.onComplete) {
          config.onComplete(
            startQuiz,
            showResults,
            crushName,
            currentQuestion,
            totalScore,
            QUIZ_DATA.questions.length
          );
        } else {
          console.warn(
            `No onComplete handler found for phase: ${phase}. Restarting welcome.`
          );
          // Fallback: If no config or handler, restart welcome unless it's the final result phase
          if (phase !== "result") {
            initWelcome();
          }
        }
      } else if (phaseProgress === "in_progress") {
        // If the phase was in_progress, it means the bot was in the middle of *doing something*
        // (sending initial messages for the phase) or waiting for user input.
        const config = PHASE_CONFIG[phase];
        if (config) {
          const expectedInitialMessages = config.initialBotMessages(crushName);
          // Check if all expected initial messages for this phase are already in the saved history
          const allInitialMessagesPresent = expectedInitialMessages.every(
            (msg) => isMessageAlreadyInHistory(msg, savedMessages)
          );

          if (
            !allInitialMessagesPresent &&
            expectedInitialMessages.length > 0
          ) {
            // If not all initial messages for this phase are in history, re-send them.
            // This covers reloads happening mid-way through addBotMessages.
            (async () => {
              updateState({ phase, phaseProgress: "in_progress" }); // Ensure state is correctly set
              // Pass savedMessages to addBotMessages to prevent re-adding already-present messages
              await addBotMessages(expectedInitialMessages, savedMessages);
              updateState({ phaseProgress: "complete" }); // Mark complete after re-sending
              // Then trigger the onComplete action for this phase
              config.onComplete(
                startQuiz,
                showResults,
                crushName,
                currentQuestion,
                totalScore,
                QUIZ_DATA.questions.length
              );
            })();
          } else {
            // All initial messages are present OR this phase doesn't have fixed initial messages (like 'questions').
            // Trigger the 'next action' for this specific phase based on its nature.
            switch (phase) {
              case "welcome":
                // Input field for name will be rendered by renderInput.
                // No specific bot action needed if messages are already there.
                break;
              case "start_quiz":
                // Messages are present, so it means we were about to start quiz.
                setTimeout(() => startQuiz(), 100);
                break;
              case "questions":
                // Show options, question and intro messages should be in saved messages.
                setShowOptions(true);
                break;
              case "result":
                // Re-trigger showResults to ensure all messages (including dynamic result) are shown.
                // showResults will also handle the "calculating" messages if they aren't fully sent.
                showResults(totalScore);
                break;
            }
          }
        } else {
          console.warn(
            `No config found for phase: ${phase}. Restarting welcome.`
          );
          initWelcome();
        }
      } else {
        // 'not_started' or initial load with no saved state
        initWelcome();
      }
    }
  }, [
    state.phase,
    state.phaseProgress,
    state.currentQuestion,
    state.totalScore,
    state.crushName,
    initWelcome,
    startQuiz,
    showResults,
    presentQuestion, // Dependency for `startQuiz`
    updateState,
    addBotMessages,
    addReaction, // Dependency for `showResults`
    messages, // Dependency for `addBotMessages` and `initWelcome`
    isMessageAlreadyInHistory, // Dependency for `isMessageAlreadyInHistory`
  ]);

  // --- Render Functions for UI Sections ---

  // Renders the input field for name or null otherwise
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

  // Renders the option buttons during the questions phase
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

  // Renders the restart buttons after the quiz results are shown
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

  // Main component render
  return (
    <div className="lg:p-[2.5%] grid gap-6 w-screen h-screen grid-rows-[auto_1fr] grid-cols-[2fr_1.2fr]">
      <header className="col-span-2 h-fit flex justify-between rounded-lg p-4 bg-shadow-primary">
        <article className="flex gap-2 items-center">
          <span className="font-chango font-extrabold text-pink-500 text-xl">
            Lovey
          </span>
        </article>
        <div className="flex items-center gap-2">
          <Image
            src="/images/love-pix.svg"
            alt={`love-pixel`}
            width={36}
            height={36}
          />
        </div>
      </header>
      <main className="col-span-1 h-full bg-shadow-primary rounded-lg pl-6 pr-8 py-8 flex flex-col gap-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id}>
            <ChatBubble message={message} isBot={message.type === "bot"} />
            {message.reaction && <ReactionBubble reaction={message.reaction} />}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
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
