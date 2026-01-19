type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const base =
  "w-full h-[44px] rounded bg-[#F9FAFB] px-3 py-4 text-md outline-none transition placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500";

export default function Input({ error, className = "", ...props }: Props) {
  const borderClass = error
    ? "border-red-400 focus:ring-red-500"
    : "border-gray-200";

  return (
    <div className="relative">
      <input {...props} className={`${base} ${borderClass} ${className}`} />
    </div>
  );
}
