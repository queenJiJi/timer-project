import { forwardRef } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: React.ReactNode;
  error?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", checked, onChange, ...props }, ref) => {
    const isChecked = Boolean(checked);

    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          {...props}
          className="sr-only"
        />
        <span
          className={[
            "text-sm transition-colors",
            isChecked ? "text-mainColor" : "text-mainColor/30",
          ].join(" ")}
        >
          {label}
        </span>

        <span
          className={[
            "relative inline-flex h-[18px] w-[18px] items-center justify-center rounded-md border-2 bg-white transition-colors",
            error ? "border-[#DC2626]" : "border-mainColor",
            isChecked ? "bg-mainColor/10 border-mainColor" : "",
            className,
          ].join(" ")}
        >
          {isChecked ? (
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 text-mainColor"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : null}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
