import type { ReactNode } from "react";

const COLUMNS = 14;
const ROWS = 8;
const OCEAN = ["#03045e", "#023e8a", "#0077b6", "#0096c7"];

// Page transition: a grid of ocean-blue blocks covers the page and clears in a diagonal
// wave. Pure CSS, so it also runs before hydration; templates remount on every
// navigation, which replays it. Hidden entirely for reduced motion (globals.css).
export function PixelTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden="true" className="pixel-transition pointer-events-none fixed inset-0 z-[100] grid" style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}>
        {Array.from({ length: COLUMNS * ROWS }, (_, index) => {
          const column = index % COLUMNS;
          const row = Math.floor(index / COLUMNS);
          const delay = (column + row) * 16 + ((index * 37) % 5) * 10;
          return (
            <span
              key={index}
              className="pixel-transition-cell"
              style={{ background: OCEAN[(column * 3 + row) % OCEAN.length], animationDelay: `${delay}ms` }}
            />
          );
        })}
      </div>
      {children}
    </>
  );
}
