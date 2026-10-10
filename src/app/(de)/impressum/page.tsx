import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Impressum · Sentrix Code",
  description: "Impressum der Sentrix Code GmbH i. G., Monheim am Rhein.",
};

// Company facts from WEBSITE.md, "Das Unternehmen". Nothing here may be invented.
const sections: LegalSection[] = [
  {
    id: "anbieter",
    title: "Anbieter",
    body: (
      <>
        <p>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG):</p>
        <p>
          <strong>Sentrix Code GmbH i. G.</strong> (in Gründung)
          <br />
          Krischerstraße 14
          <br />
          40789 Monheim am Rhein
          <br />
          Deutschland
        </p>
      </>
    ),
  },
  {
    id: "vertretung",
    title: "Vertretungsberechtigte",
    body: <p>Die Gesellschaft wird vertreten durch die Geschäftsführer Luca Finn Wiegand und Sven Fredrik Maibaum.</p>,
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <p>
        E-Mail: <a href="mailto:contact@sentrixcode.com">contact@sentrixcode.com</a>
        <br />
        Kontaktformular: <Link href="/kontakt/">sentrixcode.com/kontakt</Link>
      </p>
    ),
  },
  {
    id: "register",
    title: "Registereintrag",
    body: (
      <p>
        Der Gesellschaftsvertrag wurde am 21.09.2026 notariell beurkundet. Die Eintragung in das Handelsregister beim
        Amtsgericht Düsseldorf steht aus. Registergericht und Registernummer werden nach der Eintragung hier ergänzt; bis dahin
        führt die Gesellschaft den Zusatz „i. G.“.
      </p>
    ),
  },
  {
    id: "umsatzsteuer",
    title: "Umsatzsteuer-Identifikationsnummer",
    body: <p>Die Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz wird nach Erteilung ergänzt.</p>,
  },
  {
    id: "streitbeilegung",
    title: "Verbraucherstreitbeilegung",
    body: (
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
    ),
  },
  {
    id: "haftung-inhalte",
    title: "Haftung für Inhalte",
    body: (
      <p>
        Wir erstellen die Inhalte dieser Website mit Sorgfalt. Für die Richtigkeit, Vollständigkeit und Aktualität können wir
        dennoch keine Gewähr übernehmen. Für eigene Inhalte sind wir nach den allgemeinen Gesetzen verantwortlich. Für fremde
        Informationen, die wir übermitteln oder speichern, richtet sich unsere Verantwortlichkeit nach den Artikeln 4 bis 8 der
        Verordnung (EU) 2022/2065 über digitale Dienste (Digital Services Act).
      </p>
    ),
  },
  {
    id: "haftung-links",
    title: "Haftung für Links",
    body: (
      <p>
        Diese Website enthält Links zu Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese Inhalte ist
        der jeweilige Anbieter verantwortlich. Werden uns Rechtsverletzungen bekannt, entfernen wir die betroffenen Links
        umgehend.
      </p>
    ),
  },
  {
    id: "urheberrecht",
    title: "Urheberrecht",
    body: (
      <p>
        Texte, Grafiken und Code dieser Website unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung und
        Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen unserer schriftlichen Zustimmung. Inhalte Dritter sind als
        solche gekennzeichnet.
      </p>
    ),
  },
  {
    id: "bildnachweise",
    title: "Bildnachweise",
    body: (
      <ul>
        <li>Spielszenen aus Heistline: © Emotions-Gaming</li>
        <li>Spielszenen aus Mr. Dork 3: One Last Doodle: © MayStudios und Simsalabim Studio</li>
        <li>Screenshots und Symbole der Apps SplitUp, FamFlow, Shapes und Tiles: aus eigenen Projekten unseres Teams</li>
        <li>Pixel-Illustrationen und Figuren: Sentrix Code, teilweise mit Unterstützung von KI-Werkzeugen erstellt</li>
      </ul>
    ),
  },
];

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      intro="Wer hinter dieser Website steht und wie Sie uns erreichen."
      updated="10.10.2026"
      sections={sections}
    />
  );
}
