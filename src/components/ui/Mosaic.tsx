// Pixel mosaic of square tiles in ocean blues, as in the reference's illustration panels.
// Deterministic, so server and browser render the same tiles.

const OCEAN = ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef", "#caf0f8"];

type MosaicProps = {
  columns?: number;
  rows?: number;
  // Lightest tile level at the start corner and the level reached at the opposite corner.
  from?: number;
  to?: number;
  seed?: number;
  twinkle?: boolean;
  className?: string;
};

export function Mosaic({ columns = 16, rows = 9, from = 7, to = 1, seed = 1, twinkle = true, className = "" }: MosaicProps) {
  const tiles = Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const t = (column / (columns - 1)) * 0.65 + (row / (rows - 1)) * 0.35;
    const noise = (((index + seed * 7) * 37) % 13) / 13 - 0.5;
    const level = Math.round(from + (to - from) * t + noise * 1.4);
    return {
      color: OCEAN[Math.min(OCEAN.length - 1, Math.max(0, level))],
      sparkle: twinkle && ((index + seed) * 53) % 17 === 0,
      delay: (((index + seed) * 29) % 50) / 10,
    };
  });
  return (
    <div
      aria-hidden="true"
      className={`ambient grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {tiles.map((tile, index) => (
        <span
          key={index}
          className={tile.sparkle ? "animate-twinkle" : ""}
          style={{ background: tile.color, animationDelay: `${tile.delay}s` }}
        />
      ))}
    </div>
  );
}
