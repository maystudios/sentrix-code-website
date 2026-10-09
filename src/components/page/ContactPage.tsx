"use client";

import Link from "next/link";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/types";
import { asset } from "@/lib/asset";
import { duration, ease, spring } from "@/lib/motion";
import { useMotionPolicy } from "@/components/motion/MotionPolicy";
import { PixelRobot } from "@/components/brand/PixelCharacters";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SiteShell } from "@/components/site/SiteShell";

type Values = { name: string; email: string; company: string; topic: string; message: string; consent: boolean };
type Field = keyof Values;
type Status = "idle" | "sent" | "unavailable";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values, copy: Dictionary["pages"]["contact"]["form"]) {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = copy.required;
  if (!values.email.trim()) errors.email = copy.required;
  else if (!EMAIL.test(values.email.trim())) errors.email = copy.invalidEmail;
  if (!values.message.trim()) errors.message = copy.required;
  else if (values.message.trim().length < 20) errors.message = copy.tooShort;
  if (!values.consent) errors.consent = copy.required;
  return errors;
}

export function ContactPage({ dict, alternateHref }: { dict: Dictionary; alternateHref: string }) {
  const { pages } = dict;
  const page = pages.contact;
  const copy = page.form;
  const id = useId();
  const { reduced } = useMotionPolicy();
  const [values, setValues] = useState<Values>({ name: "", email: "", company: "", topic: copy.topics[0], message: "", consent: false });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [plane, animatePlane] = useAnimate();

  const errors = validate(values, copy);
  const show = (field: Field) => (submitted || touched[field]) && errors[field];
  const set = <K extends Field>(field: K, value: Values[K]) => setValues((current) => ({ ...current, [field]: value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    const address = dict.contact.email;
    if (!address) {
      setStatus("unavailable");
      return;
    }
    const subject = `[Sentrix Code] ${values.topic} · ${values.name}`;
    const body = `${values.message}\n\n${values.name}${values.company ? `, ${values.company}` : ""}\n${values.email}`;
    if (!reduced) {
      await animatePlane(plane.current, { x: [0, -16, 420], y: [0, 10, -260], rotate: [0, -8, -24], opacity: [1, 1, 0] }, { duration: 1.1, ease: "easeIn" });
    }
    window.location.href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  const fieldClass = (field: Field) =>
    `mt-2 w-full rounded-[var(--radius-control)] border bg-base px-3.5 py-3 text-[15px] outline-none transition-colors duration-150 placeholder:text-muted/60 focus:border-ocean-400 ${
      show(field) ? "border-danger" : "border-line-strong hover:border-muted"
    }`;

  const errorText = (field: Field) => (
    <AnimatePresence>
      {show(field) && (
        <motion.p
          id={`${id}-${field}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1.5 text-sm text-danger"
        >
          {errors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <SiteShell dict={dict} alternateHref={alternateHref}>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-6 pb-24 pt-32 md:pt-36 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <RevealHeading as="h1" text={page.title} trigger="mount" className="text-h2-xl max-w-xl" />
            <p className="text-body-lg mt-5 max-w-xl text-muted">{page.intro}</p>

            <form noValidate onSubmit={onSubmit} className="mt-12 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-name`} className="text-sm">{copy.name}</label>
                  <input
                    id={`${id}-name`}
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => set("name", event.target.value)}
                    onBlur={() => setTouched((current) => ({ ...current, name: true }))}
                    aria-invalid={Boolean(show("name"))}
                    aria-describedby={show("name") ? `${id}-name-error` : undefined}
                    className={fieldClass("name")}
                  />
                  {errorText("name")}
                </div>
                <div>
                  <label htmlFor={`${id}-email`} className="text-sm">{copy.email}</label>
                  <input
                    id={`${id}-email`}
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => set("email", event.target.value)}
                    onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                    aria-invalid={Boolean(show("email"))}
                    aria-describedby={show("email") ? `${id}-email-error` : undefined}
                    className={fieldClass("email")}
                  />
                  {errorText("email")}
                </div>
              </div>
              <div>
                <label htmlFor={`${id}-company`} className="text-sm">{copy.company}</label>
                <input
                  id={`${id}-company`}
                  autoComplete="organization"
                  value={values.company}
                  onChange={(event) => set("company", event.target.value)}
                  className={fieldClass("company")}
                />
              </div>
              <fieldset>
                <legend className="text-sm">{copy.topic}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {copy.topics.map((topic) => (
                    <label key={topic} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name={`${id}-topic`}
                        value={topic}
                        checked={values.topic === topic}
                        onChange={() => set("topic", topic)}
                        className="peer sr-only"
                      />
                      <span className="block rounded-[var(--radius-control)] border border-line-strong px-3.5 py-2 text-sm text-muted transition-all duration-150 hover:border-muted hover:text-fg peer-checked:border-ocean-400 peer-checked:bg-ocean-400/10 peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-ocean-400 active:scale-95">
                        {topic}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor={`${id}-message`} className="text-sm">{copy.message}</label>
                <textarea
                  id={`${id}-message`}
                  rows={6}
                  placeholder={copy.messageHint}
                  value={values.message}
                  onChange={(event) => set("message", event.target.value)}
                  onBlur={() => setTouched((current) => ({ ...current, message: true }))}
                  aria-invalid={Boolean(show("message"))}
                  aria-describedby={show("message") ? `${id}-message-error` : undefined}
                  className={`${fieldClass("message")} resize-y`}
                />
                {errorText("message")}
              </div>
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={values.consent}
                    onChange={(event) => set("consent", event.target.checked)}
                    aria-invalid={Boolean(show("consent"))}
                    aria-describedby={show("consent") ? `${id}-consent-error` : undefined}
                    className="mt-0.5 size-4 shrink-0 accent-[var(--color-ocean-500)]"
                  />
                  <span>
                    {copy.consent}{" "}
                    <Link href={pages.routes.privacy} className="text-ocean-400 underline-offset-4 hover:underline">
                      {copy.privacyLabel}
                    </Link>
                    .
                  </span>
                </label>
                {errorText("consent")}
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={spring.ui}
                  className="inline-flex h-11 items-center gap-3 rounded-[var(--radius-control)] bg-ocean-700 px-5 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                >
                  {copy.submit}
                  <img ref={plane} src={asset("/images/sprites/paper-plane.webp")} alt="" className="h-5 w-auto" />
                </motion.button>
              </div>
              <div aria-live="polite">
                <AnimatePresence>
                  {status !== "idle" && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: duration.base, ease: ease.outExpo }}
                      className={`rounded-[var(--radius-control)] border px-4 py-3 text-sm ${
                        status === "sent" ? "border-ocean-400/40 bg-ocean-400/10 text-ocean-100" : "border-line-strong bg-surface text-fg"
                      }`}
                    >
                      {status === "sent" ? copy.sent : copy.unavailable}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          <aside className="lg:pt-24">
            <div className="sticky top-24 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
              <img
                src={asset(`${page.scene}-800.webp`)}
                alt={page.sceneAlt}
                width={800}
                height={450}
                className="block aspect-video w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-lg font-medium">{page.aside.title}</h2>
                <p className="mt-3 text-sm text-muted">{page.aside.text}</p>
                <p className="mt-4 text-sm">
                  <span className="text-muted">{dict.contact.emailLabel}: </span>
                  {dict.contact.email ? (
                    <a href={`mailto:${dict.contact.email}`} className="text-ocean-400">{dict.contact.email}</a>
                  ) : (
                    <span className="font-mono text-ocean-300">{dict.contact.missingEmail}</span>
                  )}
                </p>
                <div className="mt-6 flex items-center gap-4 border-t border-line pt-5">
                  <PixelRobot className="w-10 shrink-0" />
                  <p className="text-sm text-muted">{page.aside.response.text}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
