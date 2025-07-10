import { Send } from "lucide-react";
import Button from "../global/button";

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
  <div className="flex space-x-2 w-full">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && onSubmit()}
      placeholder={placeholder}
      className="flex-1 px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
    />
    <Button
      onClick={onSubmit}
      disabled={!value.trim()}
      size="small"
      className="w-10"
    >
      <Send size={20} />
    </Button>
  </div>
);
