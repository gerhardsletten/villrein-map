import { type ReactNode, useState } from "react";
import cx from "classnames";

export function SlidePanel({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cx("fixed top-full w-screen z-30 transition-all", {
        "-translate-y-full h-[calc(50vh)]": expanded,
      })}
    >
      <button
        className="absolute bottom-full left-3 bg-black text-white p-2 px-6 rounded-t-lg text-sm"
        onClick={() => setExpanded(!expanded)}
      >
        Tabell
      </button>
      <div
        className={cx(
          "bg-black h-full text-white p-4 w-screen overflow-y-auto"
        )}
      >
        {children}
      </div>
    </div>
  );
}
