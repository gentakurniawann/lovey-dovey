import React from "react";

type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ className, children, onClick }: ButtonProps) {
  return (
    <button
      className={`pixel-corners bg-pink-200 pixel-corners cursor-pointer hover:bg-pink-300 hover:scale-105 duration-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
