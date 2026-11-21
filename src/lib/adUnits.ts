export const AD_UNITS = {
  leaderboard: { key: "1c8743d7290c444a41fbe0a881b3fbc5", width: 728, height: 90 },
  rectangle: { key: "204ac3e1d66348d2a6d3c4f02054516d", width: 300, height: 250 },
} as const;

export function selectAdUnit(width: number, placement: "inline" | "sidebar") {
  return placement === "inline" && width >= 728 ? "leaderboard" : "rectangle";
}