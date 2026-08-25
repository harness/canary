import { describe, it, expect } from "vitest";
import { checkInstances } from "../src/core/check";
import { pilotIndex } from "./helpers/pilotCatalog";
import type { InstanceSnapshot } from "../src/core/types";

const index = pilotIndex();

function makeSnapshot(i: number): InstanceSnapshot {
  return {
    nodeId: `stress:${i}`,
    nodeName: `Button ${i}`,
    mainComponentName: "❖Button",
    componentKey: null,
    isFromLibrary: true,
    properties: {
      variant: i % 17 === 0 ? "subtle" : "primary",
      size: "sm",
      theme: "⚫ default",
      rounded: false,
      disabled: false,
      iconOnly: false,
      "icon#1567:1": i % 3 === 0,
    },
  };
}

describe("checkInstances performance", () => {
  it("checks 2_000 synthetic Button snapshots within the dogfood budget", () => {
    const snapshots = Array.from({ length: 2_000 }, (_, i) => makeSnapshot(i));
    const options = {
      treatMissingLibraryFlagAs: "ignore" as const,
      strictUnmapped: false,
    };

    // Exclude JIT / first-load cost so the budget measures matching, not cold start.
    checkInstances(snapshots, index, options);

    const t0 = performance.now();
    const report = checkInstances(snapshots, index, options);
    const elapsed = performance.now() - t0;

    expect(report.summary.instanceCount).toBe(2000);
    expect(report.summary.mappedCount).toBe(2000);
    expect(report.summary.fail).toBeGreaterThan(0);
    // Local target is ~100ms (Task 16). Hosted CI is noisier; 250ms still fails
    // if matching regresses enough to freeze a 2k-instance page.
    expect(elapsed).toBeLessThan(250);
  });
});
