"use client";

import { useRef, type KeyboardEvent } from "react";

// Keyboard behaviour for an ARIA tablist: arrow keys, Home and End move between tabs
// and activate them; only the active tab is in the Tab order (roving tabindex).
export function useRovingTabs(count: number, active: number, select: (index: number) => void, orientation: "horizontal" | "vertical") {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const next = orientation === "vertical" ? ["ArrowDown", "ArrowRight"] : ["ArrowRight", "ArrowDown"];
    const previous = orientation === "vertical" ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
    let target: number | null = null;
    if (next.includes(event.key)) target = (active + 1) % count;
    else if (previous.includes(event.key)) target = (active - 1 + count) % count;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = count - 1;
    if (target === null) return;
    event.preventDefault();
    select(target);
    tabs.current[target]?.focus();
  }

  return {
    tabProps: (index: number) => ({
      ref: (element: HTMLButtonElement | null) => {
        tabs.current[index] = element;
      },
      tabIndex: index === active ? 0 : -1,
      onKeyDown,
    }),
  };
}
