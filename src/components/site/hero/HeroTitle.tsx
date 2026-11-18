// The hero headline enters letter by letter: each letter rises out of its word's mask in a
// loose left-to-right order, and about every third letter rolls on once and lands on its twin
// (drawn by CSS from `data-roll`), like an odometer. The motion is plain CSS (globals.css, "hero-char"), so it starts with the
// first paint instead of waiting for hydration. Screen readers get the sentence in one piece.

const SPREAD = 0.2; // seconds from the first to the last letter of a segment
const JITTER = 0.07; // seconds of random offset per letter
const ROLL_SHARE = 0.34;

// Deterministic noise in [0, 1), so server and client render the same order.
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function HeroSegment({ text, start }: { text: string; start: number }) {
  const letters = text.replace(/\s/g, "").length;
  let position = 0;
  return text.split(" ").map((word, w) => (
    <span key={w} aria-hidden="true" className="-mb-[0.2em] inline-flex overflow-hidden">
      {[...word].map((char, c) => {
        const index = position++;
        const seed = start * 1000 + index;
        const roll = /[\p{L}\d]/u.test(char) && noise(seed) < ROLL_SHARE;
        const delay = start + (index / Math.max(1, letters - 1)) * SPREAD + noise(seed + 0.5) * JITTER;
        return (
          <span key={c} className="hero-char relative inline-block pb-[0.2em]" data-roll={roll ? char : undefined} style={{ animationDelay: `${delay.toFixed(3)}s` }}>
            {char}
          </span>
        );
      })}
    </span>
  ));
}
