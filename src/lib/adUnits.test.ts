import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { AD_UNITS, selectAdUnit } from "./adUnits";

describe("provided banner formats", () => {
  test("sidebar uses the supplied 300x250 banner even on wide screens", () => {
    assert.deepEqual(AD_UNITS[selectAdUnit(1200, "sidebar")], {
      key: "204ac3e1d66348d2a6d3c4f02054516d", width: 300, height: 250,
    });
  });
  test("inline leaderboard requires room for the supplied 728x90 banner", () => {
    assert.equal(AD_UNITS[selectAdUnit(728, "inline")].width, 728);
    assert.equal(AD_UNITS[selectAdUnit(728, "inline")].height, 90);
    assert.equal(selectAdUnit(727, "inline"), "rectangle");
    assert.equal(selectAdUnit(288, "inline"), "rectangle");
  });
});