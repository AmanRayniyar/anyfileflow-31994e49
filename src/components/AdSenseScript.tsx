import { useEffect } from "react";

const CONSENT_KEY = "aff_cookie_consent";

/**
 * Loads Google AdSense script only after user has given cookie consent.
 * This ensures GDPR/AdSense compliance.
 */
const AdSenseScript = () => {
  useEffect(() => {
    const loadAdSense = () => {
      // Check if user has accepted cookies
      try {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (consent !== "accepted") return;
      } catch {
        return;
      }

      // Don't load if already loaded
      if (document.querySelector('script[src*="adsbygoogle"]')) return;

      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1759447626015713";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };

    // Listen for consent changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue === "accepted") {
        loadAdSense();
      }
    };

    // Try loading on mount (if consent was already given)
    const timer = setTimeout(loadAdSense, 3000);
    window.addEventListener("storage", handleStorage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
};

export default AdSenseScript;
