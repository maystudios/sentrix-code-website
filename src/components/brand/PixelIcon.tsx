import type { IconName } from "@/content/types";
import { PixelArt } from "./PixelArt";
import { ICONS } from "./pixel-icons";

// Small icons: pixel-perfect rebuilds of generated icons (scripts/pixel-art, round 4).
// The icon fits a square of 12 × px CSS pixels (24, 36, 48 …), centred; a className with
// its own width or height overrides that size.
export function PixelIcon({ name, px = 2, className = "" }: { name: IconName; px?: number; className?: string }) {
  const size = 12 * px;
  return <PixelArt figure={ICONS[name]} width={size} height={size} align="center" className={`shrink-0 ${className}`} />;
}
