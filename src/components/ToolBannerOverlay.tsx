import { useEffect, useState } from "react";
import AdBanner from "@/components/AdBanner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { canShowBannerOverlay } from "@/lib/adOverlayPolicy";

/** A banner in a dismissible dialog, not a provider interstitial unit. Never intercepts actions. */
export default function ToolBannerOverlay({ toolId }: { toolId: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const now = Date.now();
      const startedAt = Number(sessionStorage.getItem("aff-ad-session-start")) || now;
      const previousTool = sessionStorage.getItem("aff-ad-previous-tool");
      const shown = sessionStorage.getItem("aff-ad-overlay-shown") === "1";
      sessionStorage.setItem("aff-ad-session-start", String(startedAt));
      sessionStorage.setItem("aff-ad-previous-tool", toolId);
      if (canShowBannerOverlay(startedAt, now, shown, previousTool, toolId)) {
        sessionStorage.setItem("aff-ad-overlay-shown", "1");
        setOpen(true);
      }
    } catch {
      // If session storage is unavailable, skip the overlay rather than repeat it.
    }
  }, [toolId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[380px] rounded-lg p-4 max-h-[90dvh] overflow-y-auto">
        <DialogTitle className="pr-8 text-sm">Advertisement</DialogTitle>
        <DialogDescription className="sr-only">Sponsored banner. Close at any time to continue.</DialogDescription>
        <AdBanner placement="sidebar" />
        <DialogClose asChild><Button variant="outline">Continue to tool</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}