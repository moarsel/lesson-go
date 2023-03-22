import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  variant?: "primary" | "outline";

  /**
   * How large should the button be?
   */
  fullWidth?: boolean;

  /**
   * additional class names
   */
  className?: string;

  /**
   * Button contents
   */
  children: ReactNode;

  /**
   * type attribute of button
   */
  type?: "button" | "submit" | "reset";

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
const Button = ({
  variant = "primary",
  fullWidth = false,
  children,
  type = "button",
  className,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type={type}
      className={clsx(
        "justify-center whitespace-nowrap flex flex-row items-center gap-3 px-4 py-2 font-medium",
        variant === "primary" &&
          " text-white bg-neutral-900 rounded-xl hover:bg-black/80",
        variant === "outline" &&
          " border-2 border-black rounded-xl   hover:bg-gray-100/80",
        fullWidth ? "w-full" : "w-max",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
