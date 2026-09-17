import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdUnit from "@/components/AdUnit";

/**
 * Dismissible sticky footer ad. Appears after the user scrolls a bit so it
 * never interferes with the first impression, and can be closed at any time.
 */
const StickyBottomAd = () => {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("sba_closed") === "1"
  );

  useEffect(() => {
    if (closed) return;
    const onScroll = () => {
      if (window.scrollY > 600) {
        setShow(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [closed]);

  if (closed || !show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-background/95 backdrop-blur border-t border-border py-1">
      <button
        onClick={() => {
          setClosed(true);
          sessionStorage.setItem("sba_closed", "1");
        }}
        aria-label="Close ad"
        className="absolute right-2 top-1 p-1 rounded-full bg-secondary text-foreground hover:bg-accent"
      >
        <X className="h-4 w-4" />
      </button>
      <AdUnit size="banner" label={false} className="my-0" />
    </div>
  );
};

export default StickyBottomAd;
