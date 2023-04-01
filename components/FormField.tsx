import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useId,
} from "react";

interface FormFieldProps<T> {
  className?: string;
  label: string | ReactNode;
  id?: string;
  description?: string | ReactNode;
  children: ReactNode | Array<ReactNode>;
}

export default function FormField<T>({
  label,
  description,
  id,
  className,
  children,
}: FormFieldProps<T>) {
  return (
    <div className={`relative flex flex-col  mb-7 ${className || ""} group`}>
      <div className="pb-1 print:hidden">
        <label htmlFor={id} className="text-lg font-medium text-left ">
          {label}
        </label>
      </div>
      <div className="block text-left">{children}</div>
      {description && (
        <p
          className="block mb-1 text-sm group-focus-within:text-black text-neutral-700"
          id={`${id}-description`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
