import { type ReactNode, useState } from "react";
import cx from "classnames";

export function SlidePanel({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cx(
        "absolute top-full w-screen h-[calc(50vh)] -mt- z-30 tra transition-all",
        {
          "-translate-y-full": expanded,
        }
      )}
    >
      <button
        className="absolute bottom-full -mt-10 left-3 bg-black text-white p-2 px-6 rounded-t-lg text-sm"
        onClick={() => setExpanded(!expanded)}
      >
        Tabell
      </button>
      <div className="bg-black text-white p-4 h-full w-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
