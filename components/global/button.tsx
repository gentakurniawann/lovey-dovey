import React from "react";

type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  size?: "small" | "large";
  onClick?: () => void;
};

export default function Button({
  className,
  children,
  disabled,
  size = "large",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${
        size === "large"
          ? "pixel-corners text-2xl font-bold"
          : "pixel-corners-small text-lg font-bold"
      } flex flex-row justify-center items-center gap-2 bg-pink-200 cursor-pointer text-pink-500 hover:scale-105 duration-100 ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
