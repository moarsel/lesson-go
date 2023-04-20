import {
  MdClear
} from "react-icons/md";
import Button from "./Button";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
};

function RoboCard({ title, icon, children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Component = isExpanded ? "div" : "button";

  function handleClick() {
    if (!isExpanded) {
      setIsExpanded(!isExpanded);
    }
  }

  return (
    <Component
      onClick={handleClick}
      className="flex flex-col items-start w-full gap-4 p-8 mt-10 mb-10 shadow-md ring-2 ring-black/10 rounded-xl focus-within:shadow-xl "
    >
      <div className="relative flex flex-row items-center justify-between w-full">
        <h2 className="text-xl font-bold sm:text-2xl text-slate-900">
          {title}
        </h2>
        <div className="absolute right-0">
          {isExpanded && (
            <Button
              variant="outline"
              className="w-10 h-10 rounded-full "
              aria-label="Remove section"
              onClick={() => setIsExpanded(false)}
            >
              <MdClear className="absolute text-xl" />
            </Button>
          )}
          {!isExpanded && icon}
        </div>
      </div>
      {isExpanded && <div className="">{children}</div>}
    </Component>
  );
}

export default RoboCard;
