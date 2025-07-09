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
import { usePreventReload } from "@/components/chat/preventLoading";
import { nanoid } from "nanoid";
import { CalculatingModal } from "@/components/chat/calcResult";
import router from "next/router";
import { redirect } from "next/navigation";

// Dynamic import for Lottie Player, ensuring it's only loaded on the client side
const Player = dynamic(() => import("lottie-react"), { ssr: false });

export default function ChatPage() {
  // Custom hook for authentication (assuming it redirects if not authenticated)
  useRequireAuth();
  // In your main page/component

  // State management for the quiz flow and chat messages
  // State management for the quiz flow and chat messages
  const [state, setState] = useState<QuizState>(() => loadChatState());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Refs for scrolling and message ID generation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const hasInitializedRef = useRef(false);

  const shouldBlockReload =
    (state.phase === "start_quiz" || state.phase === "questions") &&
    state.phaseProgress === "in_progress";

  usePreventReload(shouldBlockReload);

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
  const updateState = useCallback((updates: Partial<QuizState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      saveChatState(newState);
      return newState;
    });
  }, []);

  // Helper function to check if a bot message is already present in the current messages array
  const isMessageAlreadyInHistory = useCallback(
    (messageText: string, history: ChatMessage[]): boolean => {
      return history.some(
        (msg) => msg.message === messageText && msg.type === "bot"
      );
    },
    []
  );

  // FIXED: Unified function to add a message with immediate persistence
  const addMessage = useCallback(
    (message: string, type: "bot" | "user", reaction?: QuizReaction) => {
      const newMessage: ChatMessage = {
        id: `msg_${nanoid()}`,
        type,
        message,
        timestamp: Date.now(),
        reaction: reaction || undefined,
      };

      // Get current messages from storage to ensure we're working with the latest data
      const currentMessages = loadChatHistory();
      const updatedMessages = [...currentMessages, newMessage];

      // Save to persistent storage IMMEDIATELY
      saveChatHistory(updatedMessages);

      // Update UI state
      setMessages(updatedMessages);

      return newMessage;
    },
    []
  );

  // NEW: Save expected messages to prevent loss during typing
  const saveExpectedMessages = useCallback(
    (messages: string[], phase: string, context: any) => {
      const expectedMessagesKey = `expected_messages_${phase}`;
      localStorage.setItem(
        expectedMessagesKey,
        JSON.stringify({
          messages,
          phase,
          context,
          timestamp: Date.now(),
        })
      );
    },
    []
  );

  // FIXED: Function to simulate bot typing with better recovery
  const addBotMessages = async (
    messagesToAdd: string[],
    existingMessages: ChatMessage[] = [],
    withDelay: boolean = true
  ) => {
    // Always get the latest messages from storage
    let currentMessages = loadChatHistory();

    for (let i = 0; i < messagesToAdd.length; i++) {
      const message = messagesToAdd[i];

      if (!isMessageAlreadyInHistory(message, currentMessages)) {
        try {
          // Save a checkpoint indicating we're about to add this message
          const checkpointKey = `typing_checkpoint_${Date.now()}`;
          localStorage.setItem(
            checkpointKey,
            JSON.stringify({
              message,
              timestamp: Date.now(),
              messageIndex: i,
              totalMessages: messagesToAdd.length,
            })
          );

          if (withDelay) {
            setIsTyping(true);
            await delay(500 + Math.random() * 1000);
            setIsTyping(false);
          }

          // Add message with immediate persistence
          const newMessage = addMessage(message, "bot");

          // Update our local reference for the next iteration
          currentMessages = [...currentMessages, newMessage];

          // Clear the checkpoint after successful addition
          localStorage.removeItem(checkpointKey);

          if (withDelay) {
            await delay(500);
          }
        } catch (error) {
          console.error("Error adding message:", error);
          setIsTyping(false);
        }
      }
    }
  };

  // NEW: Clear expected messages after they're successfully added
  const clearExpectedMessages = useCallback((phase: string) => {
    const expectedMessagesKey = `expected_messages_${phase}`;
    localStorage.removeItem(expectedMessagesKey);
  }, []);

  // NEW: Recover expected messages on reload
  const recoverExpectedMessages = useCallback(async () => {
    const expectedMessagesKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("expected_messages_")
    );

    for (const key of expectedMessagesKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        const { messages, phase, context } = data;

        if (messages && messages.length > 0) {
          const currentMessages = loadChatHistory();

          // Check which messages are missing
          const missingMessages = messages.filter(
            (msg: any) => !isMessageAlreadyInHistory(msg, currentMessages)
          );

          if (missingMessages.length > 0) {
            await addBotMessages(missingMessages, currentMessages, false); // false = no delay
          }
        }
      } catch (error) {
        console.error("Error recovering expected messages:", error);
      }

      // Clean up after recovery
      localStorage.removeItem(key);
    }
  }, [addBotMessages, isMessageAlreadyInHistory]);

  // Helper function to recover from interrupted message sequences
  const recoverFromInterruption = useCallback(async () => {
    // First recover expected messages
    await recoverExpectedMessages();

    // Then check for typing checkpoints
    const checkpointKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("typing_checkpoint_")
    );

    if (checkpointKeys.length > 0) {
      // Process the most recent checkpoint
      const latestCheckpoint = checkpointKeys
        .map((key) => ({
          key,
          data: JSON.parse(localStorage.getItem(key) || "{}"),
        }))
        .sort((a, b) => b.data.timestamp - a.data.timestamp)[0];

      const { message } = latestCheckpoint.data;

      // Check if this message was actually added
      const currentMessages = loadChatHistory();
      if (!isMessageAlreadyInHistory(message, currentMessages)) {
        // Message was interrupted, add it immediately
        addMessage(message, "bot");
      }

      // Clean up all checkpoints
      checkpointKeys.forEach((key) => localStorage.removeItem(key));
    }
  }, [addMessage, isMessageAlreadyInHistory, recoverExpectedMessages]);

  // FIXED: Add reaction with immediate persistence
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

  // FIXED: Presents a specific question to the user with expected message tracking
  const presentQuestion = useCallback(
    async (questionIndex: number) => {
      const question = QUIZ_DATA.questions[questionIndex];
      const introMsg = QUIZ_DATA.botMessages.questionIntro(
        questionIndex + 1,
        QUIZ_DATA.questions.length
      );

      const allMessages = [...introMsg, question.question];

      // Save expected messages before starting to add them
      saveExpectedMessages(allMessages, `question_${questionIndex}`, {
        questionIndex,
      });

      // Get the latest messages from storage
      const currentMessages = loadChatHistory();
      await addBotMessages(allMessages, currentMessages);

      // Clear expected messages after successful addition
      clearExpectedMessages(`question_${questionIndex}`);

      setShowOptions(true);
    },
    [addBotMessages, saveExpectedMessages, clearExpectedMessages]
  );

  // Starts the quiz, transitioning to the questions phase
  const startQuiz = useCallback(async () => {
    updateState({ phase: "questions", phaseProgress: "in_progress" });
    await presentQuestion(state.currentQuestion || 0);
  }, [updateState, state.currentQuestion, presentQuestion]);

  // Initializes the welcome phase, sends welcome messages, and marks phase complete
  const initWelcome = useCallback(async () => {
    updateState({ phase: "welcome", phaseProgress: "in_progress" });

    const welcomeMessages = PHASE_CONFIG.welcome.initialBotMessages(
      state.crushName
    );

    // Save expected messages
    saveExpectedMessages(welcomeMessages, "welcome", {
      crushName: state.crushName,
    });

    // Get the latest messages from storage
    const currentMessages = loadChatHistory();
    await addBotMessages(welcomeMessages, currentMessages);

    // Clear expected messages after successful addition
    clearExpectedMessages("welcome");

    updateState({ phaseProgress: "complete" });
  }, [
    updateState,
    addBotMessages,
    state.crushName,
    saveExpectedMessages,
    clearExpectedMessages,
  ]);

  // Displays the final quiz results based on the total score
  const showResults = useCallback(
    async (finalScore: number) => {
      updateState({ phase: "result", phaseProgress: "in_progress" });

      setIsCalculating(true);
      await delay(600); // 200–500 ms for smoother experience

      const resultType = calculateResult(
        finalScore,
        QUIZ_DATA.questions.length
      );

      const resultMessages = QUIZ_DATA.botMessages.results[resultType](
        state.crushName
      );

      // Save result data to cookie/localStorage or shared context
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
      clearSavedData();
      setIsCalculating(false);
      // Navigate to the result page
      redirect("/result");
    },
    [updateState, state.crushName, router]
  );

  // Handles the submission of the crush's name
  const handleNameSubmit = async () => {
    if (!inputValue.trim()) return;

    const name = inputValue.trim();
    addMessage(name, "user");
    setInputValue("");

    updateState({ crushName: name });

    const startQuizMessages = PHASE_CONFIG.start_quiz.initialBotMessages(name);

    // Save expected messages
    saveExpectedMessages(startQuizMessages, "start_quiz", { name });

    // Get the latest messages from storage
    const currentMessages = loadChatHistory();
    await addBotMessages(startQuizMessages, currentMessages);

    // Clear expected messages after successful addition
    clearExpectedMessages("start_quiz");

    updateState({ phase: "start_quiz", phaseProgress: "complete" });

    PHASE_CONFIG.start_quiz.onComplete(
      startQuiz,
      showResults,
      name,
      state.currentQuestion,
      state.totalScore,
      QUIZ_DATA.questions.length
    );
  };

  // FIXED: Handles the selection of an option during the questions phase
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

    await delay(500);
    setIsTyping(true);
    await delay(500 + Math.random() * 1000);
    setIsTyping(false);

    const reaction = getRandomReaction(option.value);
    await addReaction(reaction);

    await delay(2000);

    const isLastQuestion = nextQuestion >= QUIZ_DATA.questions.length;

    if (!isLastQuestion) {
      await delay(500);
      // Pre-save the next question to prevent loss
      const nextQuestionData = QUIZ_DATA.questions[nextQuestion];
      const nextIntroMsg = QUIZ_DATA.botMessages.questionIntro(
        nextQuestion + 1,
        QUIZ_DATA.questions.length
      );
      const nextQuestionMessages = [...nextIntroMsg, nextQuestionData.question];

      saveExpectedMessages(nextQuestionMessages, `question_${nextQuestion}`, {
        questionIndex: nextQuestion,
      });

      await presentQuestion(nextQuestion);
    } else {
      updateState({ phaseProgress: "complete" });
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
    // Clear any typing checkpoints
    const checkpointKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("typing_checkpoint_")
    );
    checkpointKeys.forEach((key) => localStorage.removeItem(key));

    // Clear expected messages
    const expectedMessageKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("expected_messages_")
    );
    expectedMessageKeys.forEach((key) => localStorage.removeItem(key));

    const defaultState: QuizState = {
      phase: "welcome",
      phaseProgress: "not_started",
      currentQuestion: 0,
      answers: [],
      crushName: "",
      totalScore: 0,
      totalQuestions: QUIZ_DATA.questions.length,
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
    }, 100);
  }, [initWelcome]);

  const clearSavedData = useCallback(() => {
    resetQuiz();
  }, [resetQuiz]);

  // FIXED: Initial Load and Reload Logic with better recovery
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      // Initialize the recovery process
      (async () => {
        // FIRST: Recover from any interrupted message sequences
        await recoverFromInterruption();

        const savedMessages = loadChatHistory();
        const savedState = loadChatState();

        setState(savedState);
        messageIdRef.current = savedMessages.length;

        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }

        const { phase, phaseProgress, currentQuestion, totalScore, crushName } =
          savedState;

        // FIXED: Properly restore showOptions state
        if (phase === "questions" && phaseProgress === "in_progress") {
          setShowOptions(true);
        }

        if (phaseProgress === "complete") {
          const config = PHASE_CONFIG[phase];
          if (config && config.onComplete) {
            // Special handling for welcome phase: if user already entered name, proceed to start_quiz
            if (phase === "welcome" && crushName && crushName.trim() !== "") {
              // User has entered name, check if start_quiz messages are present
              const startQuizMessages =
                PHASE_CONFIG.start_quiz.initialBotMessages(crushName);
              const hasStartQuizMessages = startQuizMessages.every((msg) =>
                isMessageAlreadyInHistory(msg, savedMessages)
              );

              if (hasStartQuizMessages) {
                // Start quiz messages are present, proceed to quiz
                updateState({ phase: "start_quiz", phaseProgress: "complete" });
                setTimeout(() => startQuiz(), 100);
              } else {
                // Start quiz messages missing, add them and proceed
                (async () => {
                  updateState({
                    phase: "start_quiz",
                    phaseProgress: "in_progress",
                  });
                  await addBotMessages(startQuizMessages, savedMessages);
                  updateState({
                    phase: "start_quiz",
                    phaseProgress: "complete",
                  });
                  setTimeout(() => startQuiz(), 100);
                })();
              }
            } else {
              config.onComplete(
                startQuiz,
                showResults,
                crushName,
                currentQuestion,
                totalScore,
                QUIZ_DATA.questions.length
              );
            }
          } else {
            console.warn(
              `No onComplete handler found for phase: ${phase}. Restarting welcome.`
            );
            if (phase !== "result") {
              initWelcome();
            }
          }
        } else if (phaseProgress === "in_progress") {
          const config = PHASE_CONFIG[phase];
          if (config) {
            const expectedInitialMessages =
              config.initialBotMessages(crushName);
            const allInitialMessagesPresent = expectedInitialMessages.every(
              (msg) => isMessageAlreadyInHistory(msg, savedMessages)
            );

            if (
              !allInitialMessagesPresent &&
              expectedInitialMessages.length > 0
            ) {
              updateState({ phase, phaseProgress: "in_progress" });
              await addBotMessages(expectedInitialMessages, savedMessages);
              updateState({ phaseProgress: "complete" });

              if (config.onComplete) {
                config.onComplete(
                  startQuiz,
                  showResults,
                  crushName,
                  currentQuestion,
                  totalScore,
                  QUIZ_DATA.questions.length
                );
              }
            } else {
              switch (phase) {
                case "welcome":
                  // Check if user has already entered name but welcome is still in progress
                  if (crushName && crushName.trim() !== "") {
                    // User has entered name, should proceed to start_quiz
                    const startQuizMessages =
                      PHASE_CONFIG.start_quiz.initialBotMessages(crushName);
                    const hasStartQuizMessages = startQuizMessages.every(
                      (msg) => isMessageAlreadyInHistory(msg, savedMessages)
                    );

                    if (!hasStartQuizMessages) {
                      // Add missing start quiz messages
                      (async () => {
                        updateState({
                          phase: "start_quiz",
                          phaseProgress: "in_progress",
                        });
                        await addBotMessages(startQuizMessages, savedMessages);
                        updateState({
                          phase: "start_quiz",
                          phaseProgress: "complete",
                        });
                        setTimeout(() => startQuiz(), 100);
                      })();
                    } else {
                      // Messages are there, just proceed
                      updateState({
                        phase: "start_quiz",
                        phaseProgress: "complete",
                      });
                      setTimeout(() => startQuiz(), 100);
                    }
                  }
                  // If no crushName, stay in welcome (waiting for user input)
                  break;
                case "start_quiz":
                  setTimeout(() => startQuiz(), 100);
                  break;
                case "questions":
                  // Ensure the current question is displayed
                  const currentQuestionData =
                    QUIZ_DATA.questions[currentQuestion];
                  if (currentQuestionData) {
                    const introMsg = QUIZ_DATA.botMessages.questionIntro(
                      currentQuestion + 1,
                      QUIZ_DATA.questions.length
                    );
                    const questionMessages = [
                      ...introMsg,
                      currentQuestionData.question,
                    ];

                    const allQuestionMessagesPresent = questionMessages.every(
                      (msg) => isMessageAlreadyInHistory(msg, savedMessages)
                    );

                    if (!allQuestionMessagesPresent) {
                      await addBotMessages(questionMessages, savedMessages);
                    }
                  }
                  setShowOptions(true);
                  break;
                case "result":
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
          initWelcome();
        }
      })();
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
    presentQuestion,
    updateState,
    addBotMessages,
    addReaction,
    isMessageAlreadyInHistory,
    recoverFromInterruption,
  ]);
  // Render functions remain the same
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
      <CalculatingModal isOpen={isCalculating} />
      <section className="col-span-1 h-full bg-shadow-primary p-8 rounded-lg overflow-auto break-words">
        {renderOptions()}
        {renderInput()}
      </section>
    </div>
  );
}

// const showResults = useCallback(
//   async (finalScore: number) => {
//     updateState({ phase: "result", phaseProgress: "in_progress" });

//     // Get the latest messages from storage
//     let currentMessages = loadChatHistory();

//     const initialMessages = PHASE_CONFIG.result.initialBotMessages(
//       state.crushName
//     );

//     // Save expected messages for initial result messages
//     saveExpectedMessages(initialMessages, "result_initial", {
//       crushName: state.crushName,
//       finalScore,
//     });

//     // Send initial calculating messages for the result phase
//     await addBotMessages(initialMessages, currentMessages);

//     // Clear expected messages after successful addition
//     clearExpectedMessages("result_initial");

//     await delay(2000);

//     const resultType = calculateResult(finalScore, QUIZ_DATA.questions.length);
//     const resultMessages = QUIZ_DATA.botMessages.results[resultType](
//       state.crushName
//     );

//     // Save expected messages for final result messages
//     saveExpectedMessages(resultMessages, "result_final", {
//       crushName: state.crushName,
//       finalScore,
//       resultType,
//     });

//     // Get updated messages after the calculating messages
//     currentMessages = loadChatHistory();
//     await addBotMessages(resultMessages, currentMessages);

//     // Clear expected messages after successful addition
//     clearExpectedMessages("result_final");

//     updateState({ phaseProgress: "complete" });
//   },
//   [
//     updateState,
//     addBotMessages,
//     state.crushName,
//     saveExpectedMessages,
//     clearExpectedMessages,
//   ]
// );
