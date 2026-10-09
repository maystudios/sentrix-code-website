import type { Metadata } from "next";
import { en } from "@/content/en";
import { ContactPage } from "@/components/page/ContactPage";

export const metadata: Metadata = en.pages.contact.meta;

export default function Page() {
  return <ContactPage dict={en} alternateHref="/kontakt/" />;
}
