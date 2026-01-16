type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  rightSlot?: React.ReactNode;
};

const base =
  "w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500";

export default function Input({
  error,
  rightSlot,
  className = "",
  ...props
}: Props) {
  const borderClass = error
    ? "border-red-400 focus:ring-red-500"
    : "border-gray-200";

  return (
    <div className="relative">
      <input
        {...props}
        className={`${base} ${borderClass} ${
          rightSlot ? "pr-24" : ""
        } ${className}`}
      />
      {rightSlot && (
        <div className="absolute inset-y-0 right-2 flex items-center">
          {rightSlot}
        </div>
      )}
    </div>
  );
}
