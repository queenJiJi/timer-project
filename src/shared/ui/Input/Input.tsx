import { forwardRef } from "react";
type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const base =
  "w-full h-[44px] rounded bg-[#F9FAFB] px-3 py-4 text-md outline-none transition placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500";

const Input = forwardRef<HTMLInputElement, Props>(
  ({ error, className = "", ...props }, ref) => {
    const borderClass = error
      ? "border-red-400 focus:ring-red-500"
      : "border-gray-200";

    return (
      <input
        {...props}
        ref={ref}
        className={`${base} ${borderClass} ${className}`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
