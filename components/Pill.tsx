import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface PillProps {
  /**
   * Is this the principal call to action on the page?
   */
  selected?: boolean;

  /**
   * additional class names
   */
  className?: string;

  /**
   * Button contents
   */
  children: ReactNode;

  /**
   * Is the button in loading state?
   * @default false
   * */
  loading?: boolean;
}

/**
 * Primary UI component for user interaction
 */
const Pill = ({
  selected = false,
  loading = false,
  children,
  className,
  ...props
}: PillProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={clsx(
        "justify-center whitespace-nowrap flex flex-row items-center gap-3 px-3 py-1 ring-2 rounded-xl",
        selected
          ? " bg-green-50 ring-green-600 hover:bg-green-100"
          : "bg-neutral-50 ring-neutral-200 hover:bg-neutral-200/80 hover:ring-neutral-300",
        loading && "opacity-80 cursor-not-allowed animate-pulse",
        className
      )}
      {...props}
      disabled={loading || props.disabled}
    >
      {children}
    </button>
  );
};

export default Pill;
