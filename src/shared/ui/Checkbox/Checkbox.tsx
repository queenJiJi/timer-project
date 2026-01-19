import { forwardRef } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: React.ReactNode;
  error?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        {label}
        <input
          ref={ref}
          type="checkbox"
          className={`h-4 w-4 rounded-md border ${
            error ? "border-red-500" : "border-mainColor"
          } ${className}`}
          {...props}
        />
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
