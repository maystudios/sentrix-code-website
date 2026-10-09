import type { Metadata } from "next";
import { en } from "@/content/en";
import { ServicePage } from "@/components/page/ServicePage";

const service = en.pages.services.find((entry) => entry.kind === "apps")!;

export const metadata: Metadata = service.meta;

export default function Page() {
  return <ServicePage dict={en} kind="apps" alternateHref="/leistungen/app-entwicklung/" />;
}
