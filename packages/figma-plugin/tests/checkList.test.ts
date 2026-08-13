import { describe, it, expect } from "vitest";
import {
  instanceIsProblem,
  partitionInstances,
  PROBLEM_PAGE_SIZE,
} from "../src/ui/lib/checkList";
import type { InstanceResult } from "../src/core/check";
import type { InstanceSnapshot } from "../src/core/types";

function snap(id: string): InstanceSnapshot {
  return {
    nodeId: id,
    nodeName: "Button",
    mainComponentName: "Button",
    componentKey: "k",
    componentSetName: null,
    componentSetKey: null,
    isFromLibrary: true,
    properties: {},
  };
}

function inst(
  partial: Partial<InstanceResult> & Pick<InstanceResult, "status" | "ok">,
): InstanceResult {
  return {
    snapshot: snap(partial.snapshot?.nodeId ?? "1:1"),
    catalogId: partial.catalogId ?? "canary.button",
    findings: partial.findings ?? [],
    status: partial.status,
    ok: partial.ok,
  };
}

describe("checkList triage helpers", () => {
  it("treats fails, warns, and unmapped as problems", () => {
    expect(
      instanceIsProblem(
        inst({
          status: "checked",
          ok: false,
          findings: [
            {
              code: "FAIL_SHARED_VALUE",
              severity: "fail",
              nodeId: "1",
              catalogId: "canary.button",
              message: "bad",
            },
          ],
        }),
      ),
    ).toBe(true);

    expect(
      instanceIsProblem(
        inst({
          status: "checked",
          ok: true,
          findings: [
            {
              code: "DESIGN_ONLY_OK",
              severity: "warn",
              nodeId: "1",
              catalogId: "canary.button",
              message: "warn",
            },
          ],
        }),
      ),
    ).toBe(true);

    expect(
      instanceIsProblem(
        inst({
          status: "unmapped",
          ok: false,
          catalogId: undefined,
          findings: [],
        }),
      ),
    ).toBe(true);
  });

  it("treats clean passes (and info-only) as non-problems", () => {
    expect(
      instanceIsProblem(inst({ status: "checked", ok: true, findings: [] })),
    ).toBe(false);
    expect(
      instanceIsProblem(
        inst({
          status: "checked",
          ok: true,
          findings: [
            {
              code: "DESIGN_ONLY_OK",
              severity: "info",
              nodeId: "1",
              catalogId: "canary.button",
              message: "info",
            },
          ],
        }),
      ),
    ).toBe(false);
  });

  it("partitions problems ahead of passes", () => {
    const { problems, passes } = partitionInstances([
      inst({ status: "checked", ok: true, snapshot: snap("p1") }),
      inst({ status: "checked", ok: false, snapshot: snap("f1") }),
      inst({
        status: "unmapped",
        ok: false,
        catalogId: undefined,
        snapshot: snap("u1"),
      }),
    ]);
    expect(problems.map((i) => i.snapshot.nodeId)).toEqual(["f1", "u1"]);
    expect(passes.map((i) => i.snapshot.nodeId)).toEqual(["p1"]);
  });

  it("exposes a soft page size for the UI", () => {
    expect(PROBLEM_PAGE_SIZE).toBe(50);
  });
});
