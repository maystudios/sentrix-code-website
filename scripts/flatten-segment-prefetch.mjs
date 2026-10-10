// After `next build` with `output: "export"`: the export writes segment prefetch payloads
// as nested folders (out/kontakt/__next.!KGRlKQ/kontakt/__PAGE__.txt), while the router
// asks for one dot-joined file (out/kontakt/__next.!KGRlKQ.kontakt.__PAGE__.txt). On a
// plain static host like GitHub Pages those requests 404, prefetching fails and every page
// change waits for a full fetch, which delays the page slide. This copies each nested
// payload to the dot-joined name the router requests. Runs as `postbuild`.

import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
let copied = 0;

function files(dir, prefix = []) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path, [...prefix, name]) : [[path, [...prefix, name]]];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const [file, parts] of files(path)) {
        const target = join(dir, [name, ...parts].join("."));
        if (!existsSync(target)) {
          copyFileSync(file, target);
          copied += 1;
        }
      }
    } else {
      walk(path);
    }
  }
}

if (existsSync(OUT)) {
  walk(OUT);
  console.log(`flatten-segment-prefetch: ${copied} payload files copied`);
}
