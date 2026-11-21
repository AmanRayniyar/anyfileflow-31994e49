export function canShowBannerOverlay(startedAt: number, now: number, shown: boolean, previousTool: string | null, currentTool: string) {
  return !shown && startedAt > 0 && now - startedAt >= 60_000 && previousTool !== null && previousTool !== currentTool;
}