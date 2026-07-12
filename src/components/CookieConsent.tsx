import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdConsent } from "@/hooks/useAdConsent";

const CookieConsent = () => {
  const { consent, accept, decline } = useAdConsent();
  const [forceOpen, setForceOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer paint so it never blocks LCP
    const id = window.setTimeout(() => setMounted(true), 800);
    const onOpen = () => setForceOpen(true);
    window.addEventListener("aff-consent-open", onOpen);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("aff-consent-open", onOpen);
    };
  }, []);

  const visible = mounted && (consent === null || forceOpen);
  if (!visible) return null;

  const handle = (fn: () => void) => () => {
    fn();
    setForceOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and ads consent"
      className="fixed inset-x-0 bottom-0 z-[9998] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-4xl bg-card border border-border rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1 text-sm text-foreground">
          <p className="font-semibold mb-1">We value your privacy</p>
          <p className="text-muted-foreground text-xs sm:text-sm">
            We use cookies and third-party ads to keep AnyFile Flow free. Decline for an
            ad-safe, tracking-free experience. See our{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handle(decline)}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors min-h-[40px]"
          >
            Decline
          </button>
          <button
            onClick={handle(accept)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[40px]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
