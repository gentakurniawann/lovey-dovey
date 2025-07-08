import { Send } from "lucide-react";

export const TextInput = ({
  value,
  onChange,
  onSubmit,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
}) => (
  <div className="flex space-x-2">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && onSubmit()}
      placeholder={placeholder}
      className="flex-1 px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
    />
    <button
      onClick={onSubmit}
      disabled={!value.trim()}
      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Send size={20} />
    </button>
  </div>
);
