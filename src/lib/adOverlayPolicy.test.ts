import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { canShowBannerOverlay } from "./adOverlayPolicy";

describe("unobtrusive banner overlay", () => {
  it("opens automatically after five seconds, never earlier", () => {
    assert.equal(canShowBannerOverlay(4_999, false), false);
    assert.equal(canShowBannerOverlay(5_000, false), true);
  });
  it("does not reopen after cancellation during the same tool visit", () => {
    assert.equal(canShowBannerOverlay(900_000, true), false);
  });
});