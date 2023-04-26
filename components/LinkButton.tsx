import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

interface LinkButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  variant?: "primary" | "outline";

  /**
   * How large should the LinkButton be?
   */
  fullWidth?: boolean;

  /**
   * additional class names
   */
  className?: string;
  /**
   * LinkButton contents
   */
  children: ReactNode;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
const LinkButton = ({
  variant = "primary",
  fullWidth = false,
  children,
  className,
  ...props
}: LinkButtonProps & LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      className={clsx(
        "justify-center whitespace-nowrap flex flex-row items-center gap-3 px-4 py-2 font-medium",
        variant === "primary" &&
          " text-white bg-neutral-900 rounded-xl hover:bg-black/80",
        variant === "outline" &&
          " border-2 border-black rounded-xl  hover:bg-gray-100/80",
        fullWidth ? "w-full" : "w-max",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
