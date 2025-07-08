export const OptionButton = ({
  option,
  onClick,
}: {
  option: { text: string; value: number };
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full p-3 mb-2 text-left bg-white border-2 border-pink-200 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors"
  >
    {option.text}
  </button>
);
