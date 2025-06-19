"use client";

export interface ButtonProps {
  onClick?: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  text?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  text = "Click Me",
}) => {
  return (
    <button
      type="button"
      className={`px-6 py-3 rounded-md font-semibold text-white transition-colors ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-green-800 hover:bg-green-900 cursor-pointer"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text || "Click Me"}
    </button>
  );
};

export default Button;
