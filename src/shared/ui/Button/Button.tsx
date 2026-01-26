import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    fullWidth?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
  };

const buttonVariants = cva(
  [
    // base
    "relative inline-flex items-center justify-center rounded-md font-medium",
    "transition-colors select-none",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-auto",

    "after:content-[''] after:absolute after:inset-0 after:rounded-md after:opacity-0 after:pointer-events-none",
    "after:transition-opacity",

    "hover:after:opacity-10 active:after:opacity-10 after:bg-black",

    "focus:outline-none focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-[#FF47FF] focus-visible:outline-offset-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-mainColor text-white",
          "disabled:bg-[#969DA8] disabled:text-[#CCD0D6]",
          "disabled:after:opacity-0",
          "aria-disabled:bg-[#969DA8] aria-disabled:text-[#CCD0D6] aria-disabled:hover:bg-[#969DA8]",
        ].join(" "),
        secondary: [
          "bg-mainColor/10 text-mainColor",
          "disabled:bg-[#E5E7EB] disabled:text-[#969DA8]",
          "disabled:after:opacity-0",
        ].join(" "),
        tertiary: "bg-[#F9FAFB] text-mainColor",
        outline: "border border-gray-300 text-gray-900",
        ghost: "bg-transparent text-gray-900",
      },

      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
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
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
