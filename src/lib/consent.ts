// Consent for optional services (TDDDG § 25, DSGVO Art. 6 Abs. 1 lit. a and Art. 7).
//
// The site itself needs no consent: it sets no cookies, loads nothing from third parties
// and keeps only settings the visitor chose (WEBSITE.md, "Rechtliches"). This module is
// ready for the day an optional service is added:
// 1. Register the service in its category below (provider, purpose, privacy link).
// 2. Raise CONSENT_VERSION, so everyone is asked again.
// 3. Load the service only where `useConsent(category)` is true.
// Once a category holds a service, the banner asks every visitor who has not decided for
// the current version. Nothing optional runs before a "yes"; "no" is as easy as "yes", and
// the choice can be changed at any time from the footer ("Datenschutz-Einstellungen").

import { useSyncExternalStore } from "react";

export type ConsentCategory = "statistics" | "media";

export type ConsentService = {
  name: string;
  provider: string;
  purpose: string;
  privacyUrl: string;
};

// Optional services by category. Empty: the site uses none today.
export const CONSENT_SERVICES: Record<ConsentCategory, ConsentService[]> = {
  statistics: [],
  media: [],
};

export const CONSENT_CATEGORIES = Object.keys(CONSENT_SERVICES) as ConsentCategory[];
export const CONSENT_VERSION = 1;
export const CONSENT_KEY = "sentrix-consent";
const OPEN_EVENT = "sentrix-consent-open";
const CHANGE_EVENT = "sentrix-consent-change";

export type ConsentRecord = { version: number; date: string; granted: ConsentCategory[] };

// True while at least one optional service is registered: only then must visitors be asked.
export const consentNeeded = CONSENT_CATEGORIES.some((category) => CONSENT_SERVICES[category].length > 0);

// Kept in memory as well, so a choice holds for this visit even where storage is blocked.
let memory = "";

// The stored decision as a string, so useSyncExternalStore compares it cheaply.
function snapshot() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) ?? memory;
  } catch {
    return memory;
  }
}

function parse(raw: string): ConsentRecord | null {
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as ConsentRecord;
    return record.version === CONSENT_VERSION && Array.isArray(record.granted) ? record : null;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveConsent(granted: ConsentCategory[]) {
  const record: ConsentRecord = { version: CONSENT_VERSION, date: new Date().toISOString(), granted };
  memory = JSON.stringify(record);
  try {
    window.localStorage.setItem(CONSENT_KEY, memory);
  } catch {
    // Storage blocked: the choice holds in memory for this visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// The visitor's decision for the current version, or null while undecided.
export function useConsentRecord(): ConsentRecord | null {
  return parse(useSyncExternalStore(subscribe, snapshot, () => ""));
}

// Whether a category may run. Always false before a "yes".
export function useConsent(category: ConsentCategory) {
  return useConsentRecord()?.granted.includes(category) ?? false;
}

// Opens the settings dialog from anywhere (footer, privacy policy).
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentSettingsOpen(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
