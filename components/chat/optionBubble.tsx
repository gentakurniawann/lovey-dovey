import Button from "../global/button";

export const OptionButton = ({
  option,
  onClick,
}: {
  option: { text: string; value: number };
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    className="font-poppins font-semibold text-base !bg-pink-50 w-full p-3 mb-4 text-left rounded-lg"
  >
    {option.text}
  </Button>
);
