import type { Metadata } from "next";
import { de } from "@/content/de";
import { ServicePage } from "@/components/page/ServicePage";

const service = de.pages.services.find((entry) => entry.kind === "game")!;

export const metadata: Metadata = service.meta;

export default function Page() {
  return <ServicePage dict={de} kind="game" alternateHref="/en/services/game-development/" />;
}
