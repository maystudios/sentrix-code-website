import type { Metadata } from "next";
import { en } from "@/content/en";
import { ServicePage } from "@/components/page/ServicePage";

const service = en.pages.services.find((entry) => entry.kind === "software")!;

export const metadata: Metadata = service.meta;

export default function Page() {
  return <ServicePage dict={en} kind="software" alternateHref="/leistungen/softwareentwicklung/" />;
}
