import { ViewTransition, type ReactNode } from "react";

// Page change as a slide (View Transitions API via React's <ViewTransition>): the old page
// slides out to the left and the new one slides in from the right. Links back to a parent
// (logo, breadcrumb) carry the "nav-back" type and slide the other way; the language
// switch carries "nav-fade" and only cross-fades. The header has its own
// view-transition-name and stays put. CSS in globals.css ("Seitenwechsel").
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-back": "slide-back", "nav-fade": "page-fade", default: "slide-forward" }}
      exit={{ "nav-back": "slide-back", "nav-fade": "page-fade", default: "slide-forward" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
