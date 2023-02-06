import { ReactNode } from "react";

interface FormFieldProps<T> {
  className?: string;
  label: string | ReactNode;
  description?: string | ReactNode;
  children: ReactNode | Array<ReactNode>;
}

export default function FormField<T>({
  label,
  description,
  className,
  children,
}: FormFieldProps<T>) {
  return (
    <label className={`relative flex flex-col mb-4 ${className || ""}`}>
      <div className="flex items-center mb-2 space-x-3 print:hidden">
        <p className="text-lg font-bold text-left">{label}</p>
        <p>{description}</p>
      </div>
      <div className="block text-left">{children}</div>
    </label>
  );
}
