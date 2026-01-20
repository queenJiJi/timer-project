type Props = {
  label?: string;
  required?: boolean;
  errorText?: string;
  successText?: string;
  className?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  errorText,
  successText,
  className = "",
  children,
}: Props) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[#4B5563]">{label}</label>
      )}

      {children}

      {errorText ? (
        <p className="text-xs text-[#DC2626]">{errorText}</p>
      ) : successText ? (
        <p className="text-xs text-[#22C55E]">{successText}</p>
      ) : null}
    </div>
  );
}
