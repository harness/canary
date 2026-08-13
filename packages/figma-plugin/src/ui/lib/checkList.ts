import type { InstanceResult } from "../../core/check";

/** Soft UI cap — independent of the 2k scan cap. */
export const PROBLEM_PAGE_SIZE = 50;

/** Fail, warn, or not-in-catalog — what triage shows by default. */
export function instanceIsProblem(inst: InstanceResult): boolean {
  if (inst.status === "unmapped") return true;
  if (!inst.ok) return true;
  return inst.findings.some(
    (f) => f.severity === "fail" || f.severity === "warn",
  );
}

export function partitionInstances(items: InstanceResult[]): {
  problems: InstanceResult[];
  passes: InstanceResult[];
} {
  const problems: InstanceResult[] = [];
  const passes: InstanceResult[] = [];
  for (const inst of items) {
    if (instanceIsProblem(inst)) problems.push(inst);
    else passes.push(inst);
  }
  return { problems, passes };
}
