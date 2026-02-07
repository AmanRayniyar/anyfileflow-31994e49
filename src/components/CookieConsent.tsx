import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "aff_cookie_consent";

type ConsentState = "accepted" | "rejected" | null;

const CookieConsent = () => {
  const [consent, setConsent] = useState<ConsentState>(() => {
    try {
      return localStorage.getItem(CONSENT_KEY) as ConsentState;
    } catch {
      return null;
    }
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!consent) {
      // Delay showing banner to not block LCP
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  const handleAccept = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Storage full
    }
    setConsent("accepted");
    setVisible(false);
  }, []);

  const handleReject = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "rejected");
    } catch {
      // Storage full
    }
    setConsent("rejected");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-desc"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p id="cookie-desc" className="text-sm text-muted-foreground">
              We use cookies and similar technologies to improve your experience, serve personalized ads via Google AdSense, and analyze traffic.
              By clicking "Accept All," you consent to our use of cookies.
              Read our{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>{" "}
              for more details.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Reject non-essential cookies"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity min-h-[44px] min-w-[44px]"
              aria-label="Accept all cookies"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
