import { useEffect, useState } from "react";
import AdBanner from "@/components/AdBanner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BANNER_OVERLAY_DELAY_MS, canShowBannerOverlay } from "@/lib/adOverlayPolicy";

/** A banner in a dismissible dialog, not a provider interstitial unit. Never intercepts actions. */
export default function ToolBannerOverlay({ toolId }: { toolId: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
    let shown = false;
    const timer = window.setTimeout(() => {
      if (canShowBannerOverlay(BANNER_OVERLAY_DELAY_MS, shown)) {
        shown = true;
        setOpen(true);
      }
    }, BANNER_OVERLAY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [toolId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[380px] rounded-lg p-4 max-h-[90dvh] overflow-y-auto">
        <DialogTitle className="pr-8 text-sm">Advertisement</DialogTitle>
        <DialogDescription className="sr-only">Sponsored banner. Close at any time to continue.</DialogDescription>
        <AdBanner placement="sidebar" />
        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}