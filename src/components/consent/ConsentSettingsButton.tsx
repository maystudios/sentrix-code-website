"use client";

import { openConsentSettings } from "@/lib/consent";
import { Button } from "@/components/ui/Button";

// Opens the privacy settings dialog, for use inside server-rendered pages.
export function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <Button variant="secondary" size="sm" onClick={openConsentSettings}>
      {label}
    </Button>
  );
}
