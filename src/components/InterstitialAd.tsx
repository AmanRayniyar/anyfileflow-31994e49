import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface InterstitialAdProps {
  onComplete: () => void;
  onCancel: () => void;
}

const InterstitialAd = ({ onComplete, onCancel }: InterstitialAdProps) => {
  const [countdown, setCountdown] = useState(5);
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !adRef.current) return;
    loadedRef.current = true;

    (window as any).atOptions = {
      key: "8ab75cc83387ecf03d2040c7f3e0e455",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement("script");
    script.src = "https://www.highperformanceformat.com/8ab75cc83387ecf03d2040c7f3e0e455/invoke.js";
    script.async = true;
    adRef.current.appendChild(script);

    return () => {
      try { script.parentNode?.removeChild(script); } catch {}
    };
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement before continuing"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-[95vw] max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground font-medium">Sponsored — Please wait</p>
          {countdown > 0 ? (
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {countdown}s
            </span>
          ) : (
            <button
              onClick={onComplete}
              className="text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-full transition-colors min-h-[32px]"
            >
              Continue ✓
            </button>
          )}
        </div>

        <div className="flex items-center justify-center p-6" style={{ minHeight: "120px" }}>
          <div ref={adRef} className="w-full flex items-center justify-center" />
        </div>

        <div className="px-5 py-3 border-t border-border flex justify-between items-center">
          <button
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[32px]"
          >
            Cancel
          </button>
          {countdown <= 0 && (
            <button
              onClick={onComplete}
              className="text-sm font-semibold text-primary hover:underline min-h-[32px]"
            >
              Skip Ad →
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Hook to use interstitial ad before an action
export function useInterstitialAd() {
  const [pending, setPending] = useState<(() => void) | null>(null);

  const triggerWithAd = useCallback((action: () => void) => {
    setPending(() => action);
  }, []);

  const adElement = pending ? (
    <InterstitialAd
      onComplete={() => {
        const action = pending;
        setPending(null);
        action();
      }}
      onCancel={() => setPending(null)}
    />
  ) : null;

  return { triggerWithAd, adElement };
}

export default InterstitialAd;
