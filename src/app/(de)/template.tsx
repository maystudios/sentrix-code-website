import type { ReactNode } from "react";
import { PixelTransition } from "@/components/motion/PixelTransition";

// Templates remount on every navigation, so the pixel transition plays each time.
export default function Template({ children }: { children: ReactNode }) {
  return <PixelTransition>{children}</PixelTransition>;
}
