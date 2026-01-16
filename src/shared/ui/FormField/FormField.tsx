type Props = {
  label?: string;
  required?: boolean;
  errorText?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  required,
  errorText,
  children,
}: Props) {
  return (
    <div className="grid gap-1">
      {label ? (
        <label className="text-xs font-medium text-gray-700">
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      {children}

      {errorText ? <p className="text-xs text-red-500">{errorText}</p> : null}
    </div>
  );
}
