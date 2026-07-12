import { useEffect, useState, useCallback } from "react";

const KEY = "aff-ad-consent"; // "accepted" | "declined"
const EVENT = "aff-consent-change";

export type ConsentValue = "accepted" | "declined" | null;

function read(): ConsentValue {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

export function setConsent(value: "accepted" | "declined") {
  localStorage.setItem(KEY, value);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

export function openConsentPrompt() {
  window.dispatchEvent(new CustomEvent("aff-consent-open"));
}

/**
 * Detects common ad blockers by trying to load a bait resource.
 * Cached for the session.
 */
let cachedBlocked: boolean | null = null;
async function detectAdBlocker(): Promise<boolean> {
  if (cachedBlocked !== null) return cachedBlocked;
  try {
    const url =
      "https://www.highperformanceformat.com/ads.js?_=" + Date.now();
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 1500);
    await fetch(url, { method: "HEAD", mode: "no-cors", signal: controller.signal });
    clearTimeout(t);
    cachedBlocked = false;
  } catch {
    cachedBlocked = true;
  }
  return cachedBlocked;
}

export function useAdConsent() {
  const [consent, setConsentState] = useState<ConsentValue>(() => read());
  const [blocked, setBlocked] = useState<boolean>(false);

  useEffect(() => {
    const onChange = () => setConsentState(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    // Defer detection so it doesn't block LCP
    const id = window.setTimeout(() => {
      detectAdBlocker().then((b) => mounted && setBlocked(b));
    }, 1200);
    return () => {
      mounted = false;
      window.clearTimeout(id);
    };
  }, []);

  const canShowAds = consent === "accepted" && !blocked;
  const adSafeMode = consent === "declined" || blocked;

  const accept = useCallback(() => setConsent("accepted"), []);
  const decline = useCallback(() => setConsent("declined"), []);

  return { consent, blocked, canShowAds, adSafeMode, accept, decline };
}
