"use client";

import { useEffect, useState, type ReactNode } from "react";

const COLUMNS = 14;
const ROWS = 8;
const OCEAN = ["#03045e", "#023e8a", "#0077b6", "#0096c7"];

declare global {
  interface Window {
    __sentrixNavigated?: boolean;
  }
}

// Page transition: ocean-blue blocks clear in a quick diagonal wave below the header.
// Templates remount on every navigation; the first page load shows no overlay at all
// (reviewers read it as a rendering glitch), only later navigations do. Hidden entirely
// for calm motion (globals.css).
export function PixelTransition({ children }: { children: ReactNode }) {
  // Server render and hydration: false. Later client mounts (navigations): true.
  const [show] = useState(() => typeof window !== "undefined" && window.__sentrixNavigated === true);

  useEffect(() => {
    window.__sentrixNavigated = true;
  }, []);

  return (
    <>
      {show && (
        <div
          aria-hidden="true"
          className="pixel-transition pointer-events-none fixed inset-x-0 bottom-0 top-14 z-40 grid"
          style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}
        >
          {Array.from({ length: COLUMNS * ROWS }, (_, index) => {
            const column = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);
            const delay = (column + row) * 11 + ((index * 37) % 5) * 8;
            return (
              <span
                key={index}
                className="pixel-transition-cell"
                style={{ background: OCEAN[(column * 3 + row) % OCEAN.length], animationDelay: `${delay}ms` }}
              />
            );
          })}
        </div>
      )}
      {children}
    </>
  );
}
