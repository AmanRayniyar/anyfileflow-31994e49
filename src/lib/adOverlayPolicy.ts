export const BANNER_OVERLAY_DELAY_MS = 5_000;

export function canShowBannerOverlay(elapsedMs: number, shown: boolean) {
  return !shown && elapsedMs >= BANNER_OVERLAY_DELAY_MS;
}