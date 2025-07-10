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
    size="small"
    className="font-poppins font-semibold text-sm !bg-pink-50 w-full p-3 mb-4 text-center rounded-lg"
  >
    {option.text}
  </Button>
);
