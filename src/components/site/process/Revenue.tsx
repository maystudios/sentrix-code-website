"use client";

import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useMemo } from "react";
import { spring } from "@/lib/motion";
import { PixelArrowUp } from "./art";
import { random, stepped } from "./choreo";

// Release: a revenue card pops out beside the live product. Pixel bars rise to a record,
// the total counts up in euros and the growth badge pops. Live, every user who joins brings
// a new month: the bars move one place to the left, the new record grows on the right and
// its amount floats up. The figures are invented, like the product.

const BARS = 9;
const CELLS = 12;
// Card units: 100 = the card's width (the card is its own container).
const k = (value: number) => `${value}cqw`;
const PAD = 5;
const SLOT = (100 - 2 * PAD) / BARS;
const BAR = 7.2;
// One slot to the left, in % of a bar's width (bars move with transforms).
const STEP = (SLOT / BAR) * 100;

// Euros a month brings in: grows slowly, with a little noise.
function gain(month: number) {
  return Math.round((1400 + month * 90 + random(month * 13 + 1)() * 600) / 10) * 10;
}

function total(month: number) {
  let sum = 18400;
  for (let m = -BARS; m <= month; m++) sum += gain(m);
  return sum;
}

// Height in cells of the bar `place` slots from the left. The newest is always the record.
function cells(place: number, month: number) {
  if (place === BARS - 1) return CELLS;
  const curve = 0.22 + 0.7 * Math.pow(place / (BARS - 1), 1.6);
  const bump = 0.9 + random(month * 7 + 3)() * 0.2;
  return Math.max(2, Math.min(CELLS - 1, Math.round(curve * bump * CELLS)));
}

function colour(place: number) {
  return place === BARS - 1 ? "#48cae4" : place >= BARS - 3 ? "#0096c7" : "#0077b6";
}

type RevenueCardProps = {
  // Grows by one each time a user joins (GrowingPrototype, `joined`).
  month: number;
  // True while the release plays: everything builds up after `delay`.
  enter: boolean;
  delay: number;
  label: string;
  locale: string;
  reduced: boolean;
};

export function RevenueCard({ month, enter, delay, label, locale, reduced }: RevenueCardProps) {
  const format = useMemo(
    () => new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [locale],
  );
  const amount = useMotionValue(enter && !reduced ? 0 : total(month));
  const shown = useTransform(amount, (value) => format.format(Math.round(value / 10) * 10));

  // The total counts up on the release and runs on with every new month.
  useEffect(() => {
    if (reduced) {
      amount.set(total(month));
      return;
    }
    const counting = animate(
      amount,
      total(month),
      enter ? { delay: delay + 0.2, duration: 1.5, ease: [0.45, 0, 0.3, 1] } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    );
    return () => counting.stop();
  }, [amount, month, enter, delay, reduced]);

  const months = Array.from({ length: BARS }, (_, place) => month - (BARS - 1) + place);
  const growth = Math.round((gain(month) / gain(month - (BARS - 1)) - 1) * 100);

  return (
    <div
      className="@container relative border-solid border-ocean-300/70 bg-raised"
      style={{ aspectRatio: "100 / 74", borderWidth: k(0.8), borderRadius: k(3.4), boxShadow: `${k(2)} ${k(2)} 0 #03045e` }}
    >
      {/* Label and growth badge. */}
      <span className="absolute font-medium text-muted" style={{ left: k(PAD), top: k(4.4), fontSize: k(5.2), lineHeight: 1 }}>
        {label}
      </span>
      <motion.span
        key={`badge-${month}`}
        className="absolute flex items-center font-mono font-semibold text-ocean-300"
        style={{ right: k(PAD), top: k(4.2), fontSize: k(4.8), lineHeight: 1, gap: k(1.2) }}
        initial={reduced ? false : { scale: enter ? 0 : 1 }}
        animate={reduced ? undefined : { scale: enter ? 1 : [1, 1.25, 1] }}
        transition={enter ? { ...spring.playful, delay: delay + 1.1 } : { duration: 0.4, ease: "easeOut" }}
      >
        <PixelArrowUp style={{ width: k(4), height: k(4) }} />+{growth} %
      </motion.span>

      {/* The total in euros. */}
      <motion.span
        className="absolute font-semibold tabular-nums tracking-tight text-fg"
        style={{ left: k(PAD), top: k(13), fontSize: k(10.5), lineHeight: 1 }}
      >
        {shown}
      </motion.span>

      {/* Pixel bars, newest on the right. A new month moves them one slot to the left. */}
      <div className="absolute overflow-hidden" style={{ left: k(PAD), right: k(PAD), top: k(31), height: k(CELLS * 3) }}>
        <AnimatePresence>
          {months.map((m, place) => {
            const height = cells(place, m);
            return (
              <motion.span
                key={m}
                className="absolute bottom-0"
                style={{
                  left: k((SLOT - BAR) / 2),
                  width: k(BAR),
                  backgroundImage: `repeating-linear-gradient(to top, ${colour(place)} 0 ${k(2.4)}, transparent ${k(2.4)} ${k(3)})`,
                  backgroundPosition: "bottom",
                }}
                initial={reduced ? false : { height: "0%", x: `${place * STEP}%` }}
                animate={{ height: `${(height / CELLS) * 100}%`, x: `${place * STEP}%` }}
                exit={{ x: `${-STEP}%`, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                transition={
                  enter
                    ? { height: { delay: delay + 0.2 + place * 0.07, duration: 0.05 * height, ease: stepped(height) }, x: { duration: 0 } }
                    : {
                        height: { duration: place === BARS - 1 ? 0.5 : 0.3, delay: place === BARS - 1 ? 0.15 : 0, ease: stepped(place === BARS - 1 ? CELLS : 3) },
                        x: { ...spring.ui },
                      }
                }
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* What the new month brought, floating up over the record. */}
      <AnimatePresence>
        {!enter && !reduced && (
          <motion.span
            key={`gain-${month}`}
            className="absolute whitespace-nowrap font-mono font-semibold text-ocean-100"
            style={{ right: k(PAD), top: k(26), fontSize: k(4.4), lineHeight: 1 }}
            initial={{ opacity: 0, y: "60%" }}
            animate={{ opacity: [0, 1, 1, 0], y: ["60%", "-40%", "-90%", "-150%"] }}
            transition={{ duration: 1.7, times: [0, 0.2, 0.75, 1], ease: "easeOut" }}
          >
            +{format.format(gain(month))}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="absolute bg-line-strong" style={{ left: k(PAD - 1), right: k(PAD - 1), top: k(31 + CELLS * 3 + 0.4), height: k(0.8) }} />
    </div>
  );
}
