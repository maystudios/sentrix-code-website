"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary, ServiceVisualKind } from "@/content/types";
import { asset } from "@/lib/asset";
import { duration, ease, spring, stagger } from "@/lib/motion";
import { AnimatedPictogram } from "@/components/brand/AnimatedPictogram";
import { PixelRobot } from "@/components/brand/PixelCharacters";
import { Button } from "@/components/ui/Button";

type MenuKey = "services" | "company";

type HeaderProps = {
  dict: Dictionary;
  // Same page in the other language; defaults to the other home page.
  alternateHref?: string;
  isHome?: boolean;
};

const SCENES: Record<ServiceVisualKind, string> = {
  game: "/images/scenes/games-studio-800.webp",
  software: "/images/scenes/server-room-800.webp",
  apps: "/images/scenes/app-world-800.webp",
  ai: "/images/scenes/ai-lab-800.webp",
};

// Header with Mistral-style mega menus: hover or keyboard opens a panel, items carry
// pixel icons, and a preview card cross-fades to the hovered service.
export function Header({ dict, alternateHref, isHome = false }: HeaderProps) {
  const { pages } = dict;
  const anchor = (id: string) => (isHome ? `#${id}` : `${pages.routes.home}#${id}`);
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [preview, setPreview] = useState<ServiceVisualKind>("game");
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttons = useRef<Record<MenuKey, HTMLButtonElement | null>>({ services: null, company: null });
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const open = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        buttons.current[menu]?.focus();
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const topItems: ({ key: MenuKey; label: string } | { href: string; label: string })[] = [
    { key: "services", label: pages.menu.services },
    { href: anchor(dict.anchors.cases), label: dict.nav.cases },
    { href: anchor(dict.anchors.process), label: dict.nav.process },
    { key: "company", label: pages.menu.company },
  ];

  const companyLinks = [
    { label: pages.menu.about, href: pages.routes.about },
    { label: dict.nav.process, href: anchor(dict.anchors.process) },
    { label: dict.nav.cases, href: anchor(dict.anchors.cases) },
    { label: dict.faq.title.replace(/\.$/, ""), href: anchor(dict.anchors.faq) },
    { label: dict.nav.contact, href: pages.routes.contact },
  ];

  const solid = scrolled || menu !== null || mobileOpen;

  return (
    <header
      onMouseLeave={scheduleClose}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line bg-base/95 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-stretch">
        <motion.div initial="rest" animate="rest" whileHover="hover" className="flex">
          <Link
            href={pages.routes.home}
            className="flex items-center gap-2.5 border-r border-line px-4 font-medium tracking-tight lg:px-5"
          >
            <AnimatedPictogram className="h-4 w-auto" />
            <span>Sentrix Code</span>
          </Link>
        </motion.div>

        <LayoutGroup>
          <nav className="hidden md:flex" onMouseLeave={() => setHovered(null)}>
            {topItems.map((item) => {
              const id = "key" in item ? item.key : item.href;
              const highlight = hovered === id || ("key" in item && menu === item.key);
              const inner = (
                <>
                  {highlight && (
                    <motion.span layoutId="nav-hover" className="absolute inset-1.5 rounded-[var(--radius-control)] bg-raised" transition={spring.ui} />
                  )}
                  <span className="relative">{item.label}</span>
                </>
              );
              const className =
                "relative flex items-center gap-1.5 border-r border-line px-5 text-sm text-muted transition-colors duration-150 hover:text-fg focus-visible:text-fg";
              if ("key" in item) {
                const expanded = menu === item.key;
                return (
                  <button
                    key={id}
                    ref={(element) => {
                      buttons.current[item.key] = element;
                    }}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={expanded ? `menu-${item.key}` : undefined}
                    onMouseEnter={() => {
                      setHovered(id);
                      open(item.key);
                    }}
                    onClick={() => (expanded ? setMenu(null) : open(item.key))}
                    className={`${className} ${expanded ? "text-fg" : ""}`}
                  >
                    {inner}
                    <motion.svg
                      viewBox="0 0 10 6"
                      aria-hidden="true"
                      className="relative h-1.5 w-2.5"
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={spring.ui}
                    >
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </motion.svg>
                  </button>
                );
              }
              return (
                <Link
                  key={id}
                  href={item.href}
                  onMouseEnter={() => {
                    setHovered(id);
                    scheduleClose();
                  }}
                  onFocus={() => setHovered(id)}
                  className={className}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="ml-auto flex items-stretch">
          <Link
            href={alternateHref ?? dict.nav.switchLanguage.href}
            aria-label={dict.nav.switchLanguage.label}
            className="flex items-center border-l border-line px-4 font-mono text-xs text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
          >
            {dict.nav.switchLanguage.short}
          </Link>
          <div className="hidden items-center border-l border-line px-3 md:flex">
            <Button href={pages.routes.contact} size="sm">
              {dict.nav.cta}
            </Button>
          </div>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? "mobile-menu" : undefined}
            onClick={() => setMobileOpen((value) => !value)}
            className="flex w-14 items-center justify-center border-l border-line md:hidden"
          >
            <span className="sr-only">{mobileOpen ? dict.nav.close : dict.nav.menu}</span>
            <span className="relative block h-3 w-5" aria-hidden="true">
              <motion.span
                className="absolute left-0 top-0 h-px w-5 bg-fg"
                animate={mobileOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={spring.ui}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-px w-5 bg-fg"
                animate={mobileOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={spring.ui}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Desktop mega menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key={menu}
            id={`menu-${menu}`}
            onMouseEnter={() => open(menu)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: duration.fast } }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
            className="absolute inset-x-0 top-14 hidden border-b border-line bg-base/95 backdrop-blur-md md:block"
          >
            <div className="mx-auto grid max-w-[1280px] gap-6 px-6 py-6 md:grid-cols-[1.5fr_1fr]">
              {menu === "services" ? (
                <>
                  <ul className="grid grid-cols-2 gap-1">
                    {pages.services.map((service, index) => (
                      <motion.li
                        key={service.kind}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring.ui, delay: index * stagger }}
                      >
                        <Link
                          href={pages.routes.services[service.kind]}
                          onMouseEnter={() => setPreview(service.kind)}
                          onFocus={() => setPreview(service.kind)}
                          onClick={() => setMenu(null)}
                          className={`group flex items-start gap-3 rounded-[var(--radius-card)] border p-3 transition-colors duration-150 ${
                            preview === service.kind ? "border-line-strong bg-surface" : "border-transparent hover:bg-surface"
                          }`}
                        >
                          <motion.img
                            src={asset(service.icon)}
                            alt=""
                            className="size-9 shrink-0 object-contain"
                            animate={preview === service.kind ? { rotate: [0, -8, 6, 0], y: -2 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.45 }}
                          />
                          <span>
                            <span className="block font-medium">{service.nav}</span>
                            <span className="mt-0.5 block text-sm text-muted">{service.menuText}</span>
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  <Link
                    href={pages.routes.services[preview]}
                    onClick={() => setMenu(null)}
                    className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.img
                        key={preview}
                        src={asset(SCENES[preview])}
                        alt=""
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: ease.outExpo }}
                        className="aspect-video w-full object-cover"
                      />
                    </AnimatePresence>
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-base/95 to-transparent p-4 pt-10 text-sm">
                      <span className="font-medium">{pages.services.find((service) => service.kind === preview)?.nav}</span>
                      <span className="text-ocean-300 transition-transform duration-200 group-hover:translate-x-1">
                        {pages.menu.previewCta} ›
                      </span>
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <ul className="grid grid-cols-2 gap-1 self-start">
                    {companyLinks.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring.ui, delay: index * stagger }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMenu(null)}
                          className="group flex items-center justify-between rounded-[var(--radius-control)] px-3 py-3 transition-colors duration-150 hover:bg-surface"
                        >
                          <span>{link.label}</span>
                          <span className="text-ocean-400 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                            ›
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-5">
                    <PixelRobot className="w-14 shrink-0" />
                    <div>
                      <p className="text-sm text-muted">{dict.contact.text}</p>
                      <Button href={pages.routes.contact} size="sm" className="mt-3">
                        {dict.nav.cta}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
            className="max-h-[calc(100svh-3.5rem)] overflow-y-auto border-t border-line md:hidden"
          >
            <p className="px-5 pb-1 pt-4 text-xs text-muted">{pages.menu.services}</p>
            {pages.services.map((service, index) => (
              <motion.div
                key={service.kind}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring.ui, delay: index * stagger }}
              >
                <Link
                  href={pages.routes.services[service.kind]}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 border-b border-line px-5 py-3"
                >
                  <img src={asset(service.icon)} alt="" className="size-7 object-contain" />
                  {service.nav}
                </Link>
              </motion.div>
            ))}
            <p className="px-5 pb-1 pt-5 text-xs text-muted">{pages.menu.company}</p>
            {companyLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring.ui, delay: (index + 4) * stagger }}
              >
                <Link href={link.href} onClick={() => setMobileOpen(false)} className="flex h-12 items-center border-b border-line px-5">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="p-5">
              <Button href={pages.routes.contact} className="w-full justify-center">
                {dict.nav.cta}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
