import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/PageTransition";

// Templates remount on every navigation, so the page slide plays each time.
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
