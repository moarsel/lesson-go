import { TextareaHTMLAttributes, useId, useRef } from "react";
import useAutosizeTextArea from "../utils/useAutosizeTextArea";
import FormField from "./FormField";

export default function Textarea({
  label,
  description,
  value,
  onChange,
  className,
  ...props
}: {
  label: string;
  description: string;
  value: string;
  onChange: (e: any) => void;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  useAutosizeTextArea(ref.current, value);

  return (
    <FormField
      label={label}
      description={description}
      id={id}
      className={className}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        rows={4}
        className={`border-gray-400 rounded-md w-full  focus:border-black focus:ring-black ${
          className || ""
        }`}
        {...props}
      />
    </FormField>
  );
}
