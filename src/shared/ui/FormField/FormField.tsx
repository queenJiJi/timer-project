type Props = {
  label?: string;
  required?: boolean;
  errorText?: string;
  className?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  errorText,
  className = "",
  children,
}: Props) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* {label ? (
        <label className="text-sm font-medium text-[#4B5563]">
          {label}
          {children}
        </label>
      ) : (
        <div>{children}</div>
      )} */}
      {label && (
        <label className="text-sm font-medium text-[#4B5563]">{label}</label>
      )}

      {children}

      {errorText ? <p className="text-xs text-red-500">{errorText}</p> : null}
    </div>
  );
}
