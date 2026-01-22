import { cva, type VariantProps } from "class-variance-authority";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    fullWidth?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
  };

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-mainColor text-white hover:bg-blue-700 focus:ring-[#FF47FF] disabled:bg-[#969DA8] disabled:text-[#CCD0D6]",
        secondary:
          "bg-mainColor/10 text-mainColor hover:bg-mainColor/20 focus:ring-[#FF47FF] disabled:bg-[#E5E7EB] disabled:text-[#969DA8]",
        tertiary:
          "bg-[#F9FAFB] text-mainColor hover:bg-[#F4F6F8] focus:ring-[#FF47FF]",
        outline:
          "border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-400",
        ghost:
          "bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-400",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" }, // 4. 기본값 (선택)
  },
);

export default function Button({
  variant,
  size,
  disabled = false,
  isLoading = false,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
