import type { ReactNode } from "react";
import type { Dictionary } from "@/content/types";
import { Footer } from "./Footer";
import { Header } from "./Header";

type SiteShellProps = {
  dict: Dictionary;
  children: ReactNode;
  // The same page in the other language, for the header and footer language switch.
  alternateHref?: string;
  isHome?: boolean;
};

// Frame shared by every page: frame lines, header, content, footer. One wrapping element,
// so the page slide (PageTransition) names only this wrapper and the header keeps its own
// view-transition-name and stays in place.
export function SiteShell({ dict, children, alternateHref, isHome = false }: SiteShellProps) {
  return (
    <div>
      <FrameLines />
      <Header dict={dict} alternateHref={alternateHref} isHome={isHome} />
      <main className="relative">{children}</main>
      <Footer dict={dict} alternateHref={alternateHref} />
    </div>
  );
}

// The two vertical lines that frame the content column on wide screens.
export function FrameLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-1/2 z-0 hidden w-full max-w-[1280px] -translate-x-1/2 border-x border-line lg:block"
    />
  );
}
