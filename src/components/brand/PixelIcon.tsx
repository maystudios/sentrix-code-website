import type { IconName } from "@/content/types";
import { PixelArt } from "./PixelArt";
import { ICONS } from "./pixel-icons";

// Small icons: pixel-perfect rebuilds of generated icons (scripts/pixel-art). Every icon
// uses the same art-pixel size, 1/32 of the nominal box (12 × px CSS pixels), so icons
// with fewer cells come out smaller instead of coarser (review round 5). Centred in the
// box; a className with its own width or height overrides the box.
const REFERENCE_GRID = 32;

export function PixelIcon({ name, px = 2, className = "" }: { name: IconName; px?: number; className?: string }) {
  const icon = ICONS[name];
  // Sized by the caller (an illustration, not a UI icon): fill the given box.
  if (/(^|\s)(w|h|size)-/.test(className)) {
    return <PixelArt figure={icon} align="center" className={`shrink-0 ${className}`} />;
  }
  const box = 12 * px;
  const cell = box / REFERENCE_GRID;
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${className}`} style={{ width: box, height: box }}>
      <PixelArt figure={icon} width={icon.width * cell} height={icon.height * cell} align="center" className="shrink-0 overflow-visible" />
    </span>
  );
}
