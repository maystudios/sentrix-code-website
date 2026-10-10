import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · Sentrix Code",
  description: "Wie die Sentrix Code GmbH i. G. personenbezogene Daten auf dieser Website verarbeitet.",
};

// Structure and facts from WEBSITE.md, "Rechtliches". Every service named here must match
// what the site really does: hosting (GitHub Pages), e-mail (Google Workspace, see the MX
// records of sentrixcode.com), browser storage (MotionPolicy, ScrollCompanion, consent).
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
        <li>Optionale Dienste nutzen wir derzeit nicht. Kommen solche Dienste hinzu, laden wir sie erst nach Ihrer Einwilligung.</li>
      </ul>
    ),
  },
  {
    id: "verantwortlicher",
    title: "Verantwortlicher",
    body: (
      <>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die
          <br />
          <strong>Sentrix Code GmbH i. G.</strong>, Krischerstraße 14, 40789 Monheim am Rhein,
          <br />
          vertreten durch die Geschäftsführer Luca Finn Wiegand und Sven Fredrik Maibaum.
          <br />
          E-Mail: <a href="mailto:contact@sentrixcode.com">contact@sentrixcode.com</a>
        </p>
        <p>
          Einen Datenschutzbeauftragten müssen wir nach § 38 Bundesdatenschutzgesetz nicht benennen. Bei Fragen zum Datenschutz
          schreiben Sie uns einfach an die genannte Adresse.
        </p>
      </>
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
          GitHub nutzt diese Daten, um die Website auszuliefern und die Sicherheit des Dienstes zu gewährleisten. Die Verbindung
          ist per TLS verschlüsselt (HTTPS).
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
          Angaben, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen, etwa für
          Geschäftsbriefe nach Handels- und Steuerrecht.
        </p>
        <p>
          Das Kontaktformular übermittelt selbst keine Daten. Es öffnet Ihr eigenes E-Mail-Programm mit einer vorbereiteten
          Nachricht, die Sie vor dem Absenden prüfen können. Erst wenn Sie diese E-Mail senden, erreichen uns Ihre Angaben.
        </p>
        <p>
          Unsere E-Mails verarbeiten wir mit Google Workspace der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
          Irland. Google verarbeitet die Nachrichten in unserem Auftrag auf Grundlage eines Vertrags zur Auftragsverarbeitung nach
          Art. 28 DSGVO. Eine Übermittlung an die Google LLC in den USA ist dabei nicht ausgeschlossen; die Google LLC ist nach
          dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO).
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
          Diese Website setzt keine Cookies. Nur wenn Sie selbst eine Einstellung wählen, legt sie diese im Speicher Ihres
          Browsers ab:
        </p>
        <ul>
          <li>
            „sentrix-motion“ (Local Storage): Ihre Einstellung für Animationen, wenn Sie im Fußbereich eine eigene Einstellung
            wählen. Sie bleibt, bis Sie sie dort zurücksetzen oder die Website-Daten löschen.
          </li>
          <li>
            „sentrix-companion“ (Session Storage): dass Sie den kleinen Begleiter ausgeblendet haben. Die Angabe verfällt, wenn
            Sie den Tab schließen.
          </li>
          <li>
            „sentrix-consent“ (Local Storage): Ihre Auswahl in den Datenschutz-Einstellungen mit Datum, sobald Sie eine Wahl
            treffen. Sie bleibt, bis Sie sie ändern oder die Website-Daten löschen.
          </li>
        </ul>
        <p>
          Die Angaben verlassen Ihr Gerät nicht und enthalten keine personenbezogenen Daten. Die Speicherung ist unbedingt
          erforderlich, um die von Ihnen ausdrücklich gewünschte Einstellung umzusetzen (§ 25 Abs. 2 Nr. 2 TDDDG).
        </p>
      </>
    ),
  },
  {
    id: "einwilligung",
    title: "Einwilligung und Datenschutz-Einstellungen",
    body: (
      <>
        <p>
          Derzeit binden wir keine Dienste ein, für die wir Ihre Einwilligung bräuchten. Sollten wir künftig optionale Dienste
          nutzen, etwa zur Statistik oder für externe Medien, nennen wir sie hier und laden sie erst, nachdem Sie eingewilligt
          haben (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Bis dahin fragt die Website Sie nicht nach einer Einwilligung.
        </p>
        <p>
          Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Ihre Auswahl
          sehen und ändern Sie in den Datenschutz-Einstellungen, die Sie hier und im Fußbereich jeder Seite öffnen:
        </p>
        <div>
          <ConsentSettingsButton label="Datenschutz-Einstellungen öffnen" />
        </div>
      </>
    ),
  },
  {
    id: "links",
    title: "Links zu anderen Websites",
    body: (
      <p>
        Wir verlinken auf Angebote anderer Anbieter, etwa auf Steam oder die Websites unserer Referenzprojekte. Erst wenn Sie
        einem solchen Link folgen, verbindet sich Ihr Browser mit dem anderen Anbieter. Für dessen Seiten gilt seine eigene
        Datenschutzerklärung.
      </p>
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
          <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p>Schreiben Sie uns dafür einfach eine E-Mail.</p>
      </>
    ),
  },
  {
    id: "widerspruch",
    title: "Widerspruchsrecht",
    body: (
      <p>
        <strong>
          Verarbeiten wir Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO, können Sie dieser Verarbeitung aus Gründen,
          die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO). Wir verarbeiten die Daten dann
          nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen, die Ihre Interessen, Rechte und
          Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von
          Rechtsansprüchen.
        </strong>
      </p>
    ),
  },
  {
    id: "bereitstellung",
    title: "Pflicht zur Bereitstellung, keine automatisierten Entscheidungen",
    body: (
      <p>
        Sie sind weder gesetzlich noch vertraglich verpflichtet, uns personenbezogene Daten bereitzustellen. Ohne Ihre
        Kontaktangaben können wir eine Anfrage allerdings nicht beantworten. Eine automatisierte Entscheidungsfindung
        einschließlich Profiling nach Art. 22 DSGVO findet nicht statt.
      </p>
    ),
  },
  {
    id: "beschwerde",
    title: "Beschwerderecht",
    body: (
      <p>
        Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren, insbesondere in dem Mitgliedstaat Ihres Aufenthalts
        oder Arbeitsplatzes. Zuständig für uns ist die Landesbeauftragte für Datenschutz und Informationsfreiheit
        Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf.
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
