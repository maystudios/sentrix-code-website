"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { ConsentCopy } from "@/content/types";
import {
  CONSENT_CATEGORIES,
  CONSENT_SERVICES,
  consentNeeded,
  onConsentSettingsOpen,
  saveConsent,
  useConsentRecord,
  type ConsentCategory,
} from "@/lib/consent";
import { spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { Button } from "@/components/ui/Button";
import { PixelIcon } from "@/components/brand/PixelIcon";

type ConsentManagerProps = {
  copy: ConsentCopy;
  locale: string;
  privacyHref: string;
  imprintHref: string;
};

const noSubscribe = () => () => {};

// Categories that hold at least one service: only these can be switched on.
const AVAILABLE = CONSENT_CATEGORIES.filter((category) => CONSENT_SERVICES[category].length > 0);

// The banner asks once per consent version, and only while an optional service is
// registered (src/lib/consent.ts). "Reject all" weighs as much as "Accept all", and the
// banner never covers the page. `?consent=show` shows it anyway, for review.
// The settings dialog opens from the banner, the footer and the privacy policy.
export function ConsentManager({ copy, locale, privacyHref, imprintHref }: ConsentManagerProps) {
  const record = useConsentRecord();
  const { reduced } = useMotionPolicy();
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  const preview = useSyncExternalStore(noSubscribe, () => new URLSearchParams(window.location.search).get("consent") === "show", () => false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => onConsentSettingsOpen(() => setOpen(true)), []);

  const decide = (granted: ConsentCategory[]) => {
    saveConsent(granted);
    setDismissed(true);
    setOpen(false);
  };

  const banner = hydrated && !dismissed && !open && (preview || (consentNeeded && !record));

  return (
    <>
      <AnimatePresence>
        {banner && (
          <motion.section
            key="consent-banner"
            role="region"
            aria-labelledby={titleId}
            className="fixed inset-x-4 bottom-4 z-50 rounded-[var(--radius-card)] border border-line-strong bg-raised/95 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur md:right-auto md:max-w-[440px] md:p-6"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, transition: { duration: 0.18 } }}
            transition={spring.ui}
          >
            <div className="flex items-center gap-3">
              <PixelIcon name="test" px={2} />
              <h2 id={titleId} className="font-medium">
                {copy.banner.title}
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{copy.banner.text}</p>
            <p className="mt-3 flex gap-4 text-sm">
              <Link href={privacyHref} className="text-ocean-400 underline-offset-4 hover:underline">
                {copy.dialog.privacy}
              </Link>
              <Link href={imprintHref} className="text-ocean-400 underline-offset-4 hover:underline">
                {copy.dialog.imprint}
              </Link>
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => decide([])}>
                {copy.banner.reject}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => decide(AVAILABLE)}>
                {copy.banner.accept}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 w-full text-center text-sm text-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline"
            >
              {copy.banner.settings}
            </button>
          </motion.section>
        )}
      </AnimatePresence>
      <ConsentDialog open={open} onClose={() => setOpen(false)} onDecide={decide} copy={copy} locale={locale} privacyHref={privacyHref} imprintHref={imprintHref} />
    </>
  );
}

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onDecide: (granted: ConsentCategory[]) => void;
  copy: ConsentCopy;
  locale: string;
  privacyHref: string;
  imprintHref: string;
};

// A native modal dialog: it traps focus, closes with Escape and gives focus back.
function ConsentDialog({ open, onClose, onDecide, copy, locale, privacyHref, imprintHref }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const record = useConsentRecord();
  const { reduced } = useMotionPolicy();
  const [draft, setDraft] = useState<ConsentCategory[]>([]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Each opening starts from the stored choice.
  const [shownFor, setShownFor] = useState(false);
  if (open !== shownFor) {
    setShownFor(open);
    if (open) setDraft(record?.granted.filter((category) => AVAILABLE.includes(category)) ?? []);
  }

  const { dialog } = copy;
  const saved = record ? new Date(record.date).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB") : null;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[560px] overflow-visible rounded-[var(--radius-card)] border border-line-strong bg-surface p-0 text-fg backdrop:bg-base/75 backdrop:backdrop-blur-sm"
    >
      {open && (
        <motion.div
          className="max-h-[85svh] overflow-y-auto p-6 md:p-8"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={spring.ui}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-xl font-medium tracking-tight">
              {dialog.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={dialog.close}
              className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-control)] border border-line-strong text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
            >
              <svg viewBox="0 0 7 7" className="size-3" shapeRendering="crispEdges" aria-hidden="true">
                <path d="M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM4 4h1v1H4zM5 5h1v1H5zM6 6h1v1H6zM6 0h1v1H6zM5 1h1v1H5zM4 2h1v1H4zM2 4h1v1H2zM1 5h1v1H1zM0 6h1v1H0z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{dialog.intro}</p>

          <ul className="mt-6 divide-y divide-line border-y border-line">
            <Category title={dialog.categories.necessary.title} text={dialog.categories.necessary.text} state={dialog.always} checked locked />
            {CONSENT_CATEGORIES.map((category) => {
              const services = CONSENT_SERVICES[category];
              const checked = draft.includes(category);
              return (
                <Category
                  key={category}
                  title={dialog.categories[category].title}
                  text={dialog.categories[category].text}
                  note={services.length ? services.map((service) => `${service.name} (${service.provider})`).join(", ") : dialog.none}
                  checked={checked}
                  locked={!services.length}
                  onToggle={() => setDraft((current) => (checked ? current.filter((item) => item !== category) : [...current, category]))}
                />
              );
            })}
          </ul>

          {saved && (
            <p className="mt-4 text-xs text-muted">
              {dialog.saved} {saved}
            </p>
          )}
          <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
            <Button variant="secondary" size="sm" onClick={() => onDecide([])}>
              {dialog.rejectAll}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onDecide(draft)}>
              {dialog.save}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onDecide(AVAILABLE)}>
              {dialog.acceptAll}
            </Button>
          </div>
          <p className="mt-5 flex gap-4 text-sm">
            <Link href={privacyHref} onClick={onClose} className="text-ocean-400 underline-offset-4 hover:underline">
              {dialog.privacy}
            </Link>
            <Link href={imprintHref} onClick={onClose} className="text-ocean-400 underline-offset-4 hover:underline">
              {dialog.imprint}
            </Link>
          </p>
        </motion.div>
      )}
    </dialog>
  );
}

type CategoryProps = {
  title: string;
  text: string;
  note?: string;
  state?: string;
  checked: boolean;
  locked?: boolean;
  onToggle?: () => void;
};

// One category with a switch. Locked switches show their state but cannot change.
function Category({ title, text, note, state, checked, locked, onToggle }: CategoryProps) {
  const labelId = useId();
  return (
    <li className="flex items-start justify-between gap-6 py-4">
      <div>
        <p id={labelId} className="text-sm font-medium">
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
        {note && <p className="mt-1.5 text-xs text-muted/80">{note}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelId}
          disabled={locked}
          onClick={onToggle}
          className={`relative h-6 w-11 rounded-[4px] border transition-colors duration-150 disabled:cursor-not-allowed ${
            checked ? "border-ocean-400 bg-ocean-700" : "border-line-strong bg-base"
          } ${locked ? "opacity-60" : "hover:border-ocean-400"}`}
        >
          <motion.span
            className={`absolute top-[3px] block size-4 rounded-[2px] ${checked ? "bg-ocean-100" : "bg-muted"}`}
            initial={false}
            animate={{ left: checked ? 23 : 3 }}
            transition={spring.ui}
          />
        </button>
        {state && <span className="text-xs text-muted">{state}</span>}
      </div>
    </li>
  );
}
