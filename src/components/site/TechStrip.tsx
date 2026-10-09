import type { Dictionary } from "@/content/types";

// Replaces the reference's client-logo wall: we name technologies we use, not clients
// we cannot show (WEBSITE.md, "Wahrheit vor Wirkung").
export function TechStrip({ dict }: { dict: Dictionary }) {
  const items = [...dict.tech.items, ...dict.tech.items];
  return (
    <section aria-label={dict.tech.label} className="border-b border-line">
      <p className="mx-auto max-w-[1280px] px-6 pt-8 text-center text-sm text-muted">{dict.tech.label}</p>
      <div className="group relative mt-6 overflow-hidden border-t border-line [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="ambient flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              aria-hidden={index >= dict.tech.items.length}
              className="flex h-24 w-56 items-center justify-center border-r border-line text-lg font-medium tracking-tight text-muted transition-colors duration-150 hover:bg-surface hover:text-fg"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
