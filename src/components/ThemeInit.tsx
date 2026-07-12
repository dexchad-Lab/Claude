"use client";

import { useEffect } from "react";

/** Restores the saved theme on page load. Scripts placed via JSX (even
 * next/script with beforeInteractive) don't reliably execute in this
 * app's streaming/Suspense setup, so this trades a brief flash of the
 * light theme for a reliable client-side restore instead. */
export function ThemeInit() {
  useEffect(() => {
    try {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch {
      // localStorage unavailable — theme just won't restore, harmless.
    }
  }, []);

  return null;
}
