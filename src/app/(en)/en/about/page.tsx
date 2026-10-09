import type { Metadata } from "next";
import { en } from "@/content/en";
import { AboutPage } from "@/components/page/AboutPage";

export const metadata: Metadata = en.pages.about.meta;

export default function Page() {
  return <AboutPage dict={en} alternateHref="/ueber-uns/" />;
}
