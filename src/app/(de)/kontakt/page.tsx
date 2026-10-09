import type { Metadata } from "next";
import { de } from "@/content/de";
import { ContactPage } from "@/components/page/ContactPage";

export const metadata: Metadata = de.pages.contact.meta;

export default function Page() {
  return <ContactPage dict={de} alternateHref="/en/contact/" />;
}
