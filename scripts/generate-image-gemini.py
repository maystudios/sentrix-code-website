"""Generate one image with the Gemini API (Nano Banana models).

Usage:
  python scripts/generate-image-gemini.py --prompt-file P.txt --out OUT.png
      [--model gemini-3-pro-image] [--aspect 16:9] [--size 2K] [--ref IMAGE ...]

Reads GEMINI_API_KEY from the project .env (falling back to the environment) and
never prints it.
Writes the first returned image and a sidecar OUT.json with model, prompt and date
for docs/provenance.md.
"""

import argparse
import base64
import datetime
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def read_dotenv(path: str) -> dict:
    values = {}
    if not os.path.exists(path):
        return values
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            name, value = line.split("=", 1)
            values[name.strip()] = value.strip().strip('"').strip("'")
    return values


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt-file", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--model", default="gemini-3-pro-image")
    parser.add_argument("--aspect", default="1:1")
    parser.add_argument("--size", default="2K")
    parser.add_argument("--ref", action="append", default=[], help="reference image to keep a look consistent")
    args = parser.parse_args()

    # The project .env wins over the shell, because the shell may carry a key of
    # another Google project with a different spending cap.
    key = read_dotenv(".env").get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not key:
        print("GEMINI_API_KEY is not set in .env or the environment", file=sys.stderr)
        return 2

    with open(args.prompt_file, encoding="utf-8") as handle:
        prompt = handle.read().strip()

    parts = []
    for ref in args.ref:
        mime = "image/png" if ref.lower().endswith(".png") else "image/jpeg" if ref.lower().endswith((".jpg", ".jpeg")) else "image/webp"
        with open(ref, "rb") as handle:
            parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(handle.read()).decode("ascii")}})
    parts.append({"text": prompt})
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": args.aspect, "imageSize": args.size},
        },
    }
    request = urllib.request.Request(
        API.format(model=args.model),
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": key},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=300) as response:
            data = json.load(response)
    except urllib.error.HTTPError as error:
        print(f"HTTP {error.code}: {error.read().decode('utf-8', 'replace')[:800]}", file=sys.stderr)
        return 1

    for candidate in data.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                with open(args.out, "wb") as handle:
                    handle.write(base64.b64decode(inline["data"]))
                meta = {
                    "tool": "Gemini API",
                    "model": args.model,
                    "aspect": args.aspect,
                    "size": args.size,
                    "prompt": prompt,
                    "references": args.ref,
                    "date": datetime.date.today().isoformat(),
                    "usage": data.get("usageMetadata"),
                }
                with open(args.out.rsplit(".", 1)[0] + ".json", "w", encoding="utf-8") as handle:
                    json.dump(meta, handle, indent=2, ensure_ascii=False)
                print(args.out)
                return 0

    print("No image in response: " + json.dumps(data)[:800], file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
