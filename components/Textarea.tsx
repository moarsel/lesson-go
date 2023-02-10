import { TextareaHTMLAttributes, useRef } from "react";
import useAutosizeTextArea from "../utils/useAutosizeTextArea";

export default function Textarea({
  value,
  onChange,
  className,
  ...props
}: {
  value: string;
  onChange: (e: any) => void;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(ref.current, value);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      rows={5}
      style={{ minHeight: "4rem" }}
      className={`w-full p-6 mb-[-6px] border-transparent border-t-slate-200 rounded-b-xl focus:border-green-700 focus:ring-green-700 focus:ring-inset ${
        className || ""
      }`}
      {...props}
    />
  );
}
