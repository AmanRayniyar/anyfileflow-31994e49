import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { canShowBannerOverlay } from "./adOverlayPolicy";

describe("unobtrusive banner overlay", () => {
  it("waits one minute and a different tool visit", () => {
    assert.equal(canShowBannerOverlay(1000, 60999, false, "word-counter", "bmi-calculator"), false);
    assert.equal(canShowBannerOverlay(1000, 61000, false, "word-counter", "bmi-calculator"), true);
    assert.equal(canShowBannerOverlay(1000, 61000, false, null, "bmi-calculator"), false);
    assert.equal(canShowBannerOverlay(1000, 61000, false, "word-counter", "word-counter"), false);
  });
  it("never repeats within the session", () => {
    assert.equal(canShowBannerOverlay(1000, 900000, true, "word-counter", "bmi-calculator"), false);
  });
});