import type { Dictionary } from "@/content/types";
import { Cases } from "./Cases";
import { ContactCta } from "./ContactCta";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { Positioning } from "./Positioning";
import { Process } from "./Process";
import { ScrollCompanion } from "./ScrollCompanion";
import { Services } from "./Services";
import { SiteShell } from "./SiteShell";
import { Statement } from "./Statement";
import { TechStrip } from "./TechStrip";
import { ElasticLine } from "@/components/ui/ElasticLine";

export function HomePage({ dict, alternateHref }: { dict: Dictionary; alternateHref: string }) {
  return (
    <SiteShell dict={dict} alternateHref={alternateHref} isHome>
      <Hero dict={dict} />
      <TechStrip dict={dict} />
      <Statement dict={dict} />
      <Positioning text={dict.positioning} />
      <ElasticLine />
      <Services dict={dict} />
      <Cases dict={dict} />
      <ElasticLine />
      <Process dict={dict} />
      <Faq dict={dict} />
      <ContactCta dict={dict} />
      <ScrollCompanion dict={dict} />
    </SiteShell>
  );
}
