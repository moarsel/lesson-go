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
        variant === "primary" &&
          "flex flex-row items-center w-max gap-3 px-4 py-2 font-medium text-white bg-neutral-900 whitespace-nowrap rounded-xl hover:bg-black/80",
        variant === "outline" &&
          "flex flex-row items-center w-max gap-3 px-4 py-2 font-medium border-2 border-black rounded-xl  whitespace-nowrap  hover:bg-gray-100/80",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
