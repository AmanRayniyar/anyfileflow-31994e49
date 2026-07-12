import { useEffect } from "react";
import { useAdConsent } from "@/hooks/useAdConsent";

/**
 * Injects site-wide third-party ad scripts (social bar / popunder) only
 * after the user has explicitly accepted cookies AND no ad blocker is
 * present. Keeps initial payload lean and honors ad-safe mode.
 */
const SOCIAL_BAR_ID = "aff-social-bar";

const ConsentedAdScripts = () => {
  const { canShowAds } = useAdConsent();

  useEffect(() => {
    if (!canShowAds) {
      document.getElementById(SOCIAL_BAR_ID)?.remove();
      return;
    }
    if (document.getElementById(SOCIAL_BAR_ID)) return;

    // Idle-load so it doesn't compete with LCP
    const inject = () => {
      const s = document.createElement("script");
      s.id = SOCIAL_BAR_ID;
      s.async = true;
      s.setAttribute("data-cfasync", "false");
      s.src =
        "https://pl28512786.effectivecpmnetwork.com/ee/c9/8d/eec98d468a3664f6488a29f27283fcd5.js";
      document.body.appendChild(s);
    };
    const ric =
      (window as any).requestIdleCallback ||
      ((cb: () => void) => window.setTimeout(cb, 1500));
    const handle = ric(inject);
    return () => {
      const cic = (window as any).cancelIdleCallback || window.clearTimeout;
      cic(handle);
    };
  }, [canShowAds]);

  return null;
};

export default ConsentedAdScripts;
