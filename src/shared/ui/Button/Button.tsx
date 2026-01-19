type ButtonVariant = "primary" | "secondary" | "tertiary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-mainColor text-white hover:bg-blue-700 focus:ring-[#FF47FF]",
  secondary:
    "bg-mainColor/10 text-mainColor hover:bg-mainColor/20 focus:ring-[#FF47FF]",
  tertiary:
    "bg-[#F9FAFB] text-mainColor hover:bg-[#F4F6F8] focus:ring-[#FF47FF]",
  outline:
    "border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-400",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-400",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  isLoading = false,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
