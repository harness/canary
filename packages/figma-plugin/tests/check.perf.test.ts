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

// Local machines typically finish in well under 100ms (plan Task 16). Shared
// CI VMs routinely take 140–200ms for the same work, and Harness does not
// always export CI=true, so keep one budget that still fails on a real
// regression without flaking on VM noise.
const budgetMs = 500;

describe("checkInstances performance", () => {
  it(`checks 2_000 synthetic Button snapshots in under ${budgetMs}ms`, () => {
    const snapshots = Array.from({ length: 2_000 }, (_, i) => makeSnapshot(i));

    const t0 = performance.now();
    const report = checkInstances(snapshots, index, {
      treatMissingLibraryFlagAs: "ignore",
      strictUnmapped: false,
    });
    const elapsed = performance.now() - t0;

    expect(report.summary.instanceCount).toBe(2000);
    expect(report.summary.mappedCount).toBe(2000);
    expect(report.summary.fail).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(budgetMs);
  });
});
