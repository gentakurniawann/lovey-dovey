export const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-pink-100 text-pink-900 px-4 py-3 rounded-lg">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  </div>
);
