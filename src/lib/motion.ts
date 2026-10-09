// Motion tokens for the Motion library. Mirrors WEBSITE.md, "Bewegung" → "Tokens".

export const duration = {
  instant: 0.1,
  fast: 0.16,
  base: 0.28,
  slow: 0.56,
} as const;

export const ease = {
  standard: [0.4, 0, 0.2, 1],
  outExpo: [0.16, 1, 0.3, 1],
} as const;

export const spring = {
  ui: { type: "spring", stiffness: 400, damping: 30 },
  playful: { type: "spring", stiffness: 260, damping: 16 },
} as const;

export const stagger = 0.06;
