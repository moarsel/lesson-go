import { AnimatePresence, motion } from "framer-motion";
import ResizablePanel from "./ResizablePanel";

type Props = {
  content: string;
  onSelect: (value: string) => void;
};

function Suggestions({ content, onSelect }: Props) {
  return (
    <ResizablePanel>
      <AnimatePresence mode="wait">
        {content && (
          <div className="flex flex-col items-center justify-center max-w-xl my-4 space-y-4">
            {content
              .split(/\n(?=[0-9]\.)/)
              .map((item: string) => item.replace(/([0-9]\.)/, "").trim())
              .map((item: string, i: number) => {
                return (
                  <motion.button
                    className={`p-4 transition border shadow-md rounded-xl bg-white hover:bg-gray-100`}
                    onClick={() => {
                      onSelect(`${item}`);
                    }}
                    key={item}
                  >
                    <p className="flex items-center gap-5 text-left">
                      <span className="flex items-center justify-center w-8 h-8 text-lg text-white bg-green-900 rounded-full shrink-0">
                        {i + 1}
                      </span>
                      {item}
                    </p>
                  </motion.button>
                );
              })}
          </div>
        )}
      </AnimatePresence>
    </ResizablePanel>
  );
}

export default Suggestions;
