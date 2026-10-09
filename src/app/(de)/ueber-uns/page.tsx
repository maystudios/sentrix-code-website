import type { Metadata } from "next";
import { de } from "@/content/de";
import { AboutPage } from "@/components/page/AboutPage";

export const metadata: Metadata = de.pages.about.meta;

export default function Page() {
  return <AboutPage dict={de} alternateHref="/en/about/" />;
}
