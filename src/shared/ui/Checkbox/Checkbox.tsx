type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: React.ReactNode;
};

export default function Checkbox({ label, className = "", ...props }: Props) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input
        {...props}
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
      />
      {label}
    </label>
  );
}
