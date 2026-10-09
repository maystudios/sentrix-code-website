import type { Metadata } from "next";
import { LegalPage, Open, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · Sentrix Code",
  description: "Wie die Sentrix Code GmbH i. G. personenbezogene Daten auf dieser Website verarbeitet.",
};

// Structure and facts from WEBSITE.md, "Rechtliches". Draft: to be reviewed before launch.
const sections: LegalSection[] = [
  {
    id: "ueberblick",
    title: "Das Wichtigste in Kürze",
    body: (
      <ul>
        <li>Diese Website setzt keine Cookies und bindet keine Analyse-, Werbe- oder Social-Media-Dienste ein.</li>
        <li>Schriften und Bilder liefern wir selbst aus; Ihr Browser verbindet sich dafür mit keinem Drittanbieter.</li>
        <li>Beim Aufruf verarbeitet unser Hosting-Anbieter technisch notwendige Verbindungsdaten.</li>
        <li>Wenn Sie uns schreiben, verwenden wir Ihre Angaben nur, um Ihre Anfrage zu beantworten.</li>
      </ul>
    ),
  },
  {
    id: "verantwortlicher",
    title: "Verantwortlicher",
    body: (
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die
        <br />
        <strong>Sentrix Code GmbH i. G.</strong>, Krischerstraße 14, 40789 Monheim am Rhein,
        <br />
        vertreten durch die Geschäftsführer Luca Finn Wiegand und Sven Fredrik Maibaum.
        <br />
        E-Mail: <Open>Kontakt-E-Mail-Adresse</Open>
      </p>
    ),
  },
  {
    id: "hosting",
    title: "Hosting bei GitHub Pages",
    body: (
      <>
        <p>
          Diese Website wird über GitHub Pages bereitgestellt, einen Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San
          Francisco, CA 94107, USA. Wenn Sie die Website aufrufen, verarbeitet GitHub technisch notwendige Daten, insbesondere
          Ihre IP-Adresse, Datum und Uhrzeit des Abrufs, die aufgerufene Adresse sowie Angaben zu Browser und Betriebssystem.
          GitHub nutzt diese Daten, um die Website auszuliefern und die Sicherheit des Dienstes zu gewährleisten.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer sicheren und
          zuverlässigen Bereitstellung der Website. Dabei können Daten in die USA übermittelt werden. GitHub, Inc. ist nach dem
          EU-US Data Privacy Framework zertifiziert; die Übermittlung stützt sich auf den Angemessenheitsbeschluss der
          Europäischen Kommission nach Art. 45 DSGVO.
        </p>
        <p>
          Wie lange GitHub diese Daten speichert, regelt die{" "}
          <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener noreferrer" target="_blank">
            Datenschutzerklärung von GitHub
          </a>
          . Wir selbst erhalten keine Protokolle mit Ihrer IP-Adresse.
        </p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt per E-Mail und Kontaktformular",
    body: (
      <>
        <p>
          Wenn Sie uns per E-Mail oder über das Kontaktformular schreiben, verarbeiten wir die Angaben, die Sie uns mitteilen,
          etwa Name, E-Mail-Adresse, Unternehmen und Ihre Nachricht, um Ihre Anfrage zu beantworten.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn Ihre Anfrage auf einen Vertrag oder dessen Vorbereitung zielt,
          und im Übrigen Art. 6 Abs. 1 lit. f DSGVO, gestützt auf unser Interesse, Anfragen zu beantworten. Wir löschen Ihre
          Angaben, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
        <p>
          Das Kontaktformular öffnet derzeit Ihr eigenes E-Mail-Programm mit einer vorbereiteten Nachricht. Es übermittelt
          selbst keine Daten. Sobald ein Formulardienst angebunden ist, ergänzen wir diesen Abschnitt.{" "}
          <Open>Formulardienst, Anbieter und Auftragsverarbeitung</Open>
        </p>
      </>
    ),
  },
  {
    id: "endgeraet",
    title: "Einstellungen in Ihrem Browser",
    body: (
      <>
        <p>
          Wählen Sie im Fußbereich der Website eine eigene Einstellung für Animationen, speichern wir diese Wahl im lokalen
          Speicher Ihres Browsers (Local Storage) unter dem Schlüssel „sentrix-motion“. Die Angabe verlässt Ihr Gerät nicht und
          enthält keine personenbezogenen Daten.
        </p>
        <p>
          Die Speicherung ist unbedingt erforderlich, um die von Ihnen ausdrücklich gewünschte Einstellung umzusetzen
          (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können sie jederzeit über denselben Schalter oder durch Löschen der Website-Daten in
          Ihrem Browser entfernen.
        </p>
      </>
    ),
  },
  {
    id: "rechte",
    title: "Ihre Rechte",
    body: (
      <>
        <p>Sie haben gegenüber uns die folgenden Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
        <ul>
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)</li>
        </ul>
        <p>Schreiben Sie uns dafür einfach eine E-Mail.</p>
      </>
    ),
  },
  {
    id: "beschwerde",
    title: "Beschwerderecht",
    body: (
      <p>
        Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Zuständig für uns ist die Landesbeauftragte für
        Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf.
      </p>
    ),
  },
  {
    id: "aenderungen",
    title: "Änderungen",
    body: (
      <p>
        Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die Rechtslage ändert. Es gilt die jeweils hier
        veröffentlichte Fassung.
      </p>
    ),
  },
];

export default function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Kurz gesagt: keine Cookies, kein Tracking, keine Drittanbieter im Browser. Hier steht alles im Detail."
      updated="10.10.2026"
      sections={sections}
    />
  );
}
