import { type ReactNode, useState } from "react";

import { DndContext, type Modifier, useDraggable } from "@dnd-kit/core";
import {
  restrictToWindowEdges,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

function SlidePanelInner({
  panelPosition,
  children,
}: {
  panelPosition: number;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  return (
    <>
      <button
        ref={setNodeRef}
        className="absolute left-4 bg-black text-white p-2 px-4 rounded-t-lg min-h-[40px] z-20"
        style={{
          top: `calc(40px + ${panelPosition}px)`,
          transform: `translate3d(0px, ${transform ? transform.y : 0}px, 0)`,
        }}
        {...listeners}
        {...attributes}
      >
        Tabell
      </button>
      <div
        className="bg-black text-white p-4 absolute min-h-[200px] w-screen mt-[40px] h-[calc(100%-40px)] z-20"
        style={{
          top: `calc(${panelPosition}px + 40px)`,
          transform: `translate3d(0px, ${transform ? transform.y : 0}px, 0)`,
        }}
      >
        {children}
      </div>
    </>
  );
}

export const SlidePanel = ({ children }: { children: ReactNode }) => {
  const [panelPosition, setPanelPosition] = useState(0);
  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, snapToGrid, restrictToWindowEdges]}
      onDragEnd={(event) => {
        console.log("end", event.delta.y, event);
        setPanelPosition(panelPosition + event.delta.y);
      }}
    >
      <SlidePanelInner panelPosition={panelPosition} children={children} />
    </DndContext>
  );
};

function makeArray(count: number) {
  return Array.from(Array(count).keys());
}

const inRange = (a: number, b: number) => Math.abs(a - b) < 20;

const createRange = (start: number, stop: number, steps: number): number[] => {
  const diff = stop - start;
  const step = diff / steps;
  return makeArray(steps).map((num) => {
    if (num + 1 === steps) {
      return stop;
    }
    return start + step * num;
  });
};

const snapToGrid: Modifier = ({
  containerNodeRect,
  draggingNodeRect,
  transform,
}) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  const dragging = {
    t: draggingNodeRect.top,
    b: draggingNodeRect.top + draggingNodeRect.height,
  };
  const num = 5;
  const steps = createRange(
    containerNodeRect.top,
    containerNodeRect.top + containerNodeRect.height,
    num
  );
  const closestB = steps.find((step, i) => {
    return i >= num / 2 && inRange(dragging.b + transform.y, step);
  });
  const closestT = steps.find((step, i) => {
    return i <= num / 2 && inRange(dragging.t + transform.y, step);
  });
  const y =
    closestB !== undefined
      ? closestB - dragging.b
      : closestT !== undefined
      ? closestT - dragging.t
      : transform.y;
  return {
    ...transform,
    y: y,
    // y: Math.ceil(transform.y / gridSize) * gridSize,
  };
};

/*
function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2);
}
*/
