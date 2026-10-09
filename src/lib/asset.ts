// Prefixes files from public/ with the GitHub Pages base path. next/link does this
// for links automatically; plain <img> sources need it explicitly.
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
