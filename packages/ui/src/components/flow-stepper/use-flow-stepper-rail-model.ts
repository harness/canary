import { useMemo } from 'react'

import { deriveFullPredictedPath, useEngineContext } from './engine'

/**
 * Path-scoped badge totals and rail click handling shared by SinglePane's embedded timeline
 * and DualPane's default left rail. Card placement stays in the callers.
 */
export function useFlowStepperRailModel(options?: { rewindCompletedClicks?: boolean }) {
  const rewindCompletedClicks = options?.rewindCompletedClicks ?? false
  const { flow, cardHistory, activeStepId, scrollToCard, requestReactivation } = useEngineContext()

  // Badge denominators below must reflect only the path THIS run will actually walk, not every
  // step configured in the flow. `flow.steps` is a flat map of EVERY step across EVERY branch —
  // real flows branch heavily (e.g. mutually-exclusive auth-provider or infra-setup steps all
  // converge on a shared next step), and a run only ever traverses one branch. Using
  // `Object.keys(flow.steps).length` as the denominator overcounts steps NOT on this run's
  // path, so the badge could never reach n/n. `deriveFullPredictedPath` walks the same `next`-pointer
  // chain as `predictedPath` (engine-context.tsx) but doesn't stop at step-group boundaries, giving
  // the full remainder of THIS run's path from the active step to the flow's terminal step.
  const { path: fullPredictedPath, reachedKnownEnd } = useMemo(
    () => deriveFullPredictedPath(flow, cardHistory, activeStepId),
    [flow, cardHistory, activeStepId]
  )

  // `reachedKnownEnd` (from the engine) only trusts a `terminal`-flagged step or a confirmed
  // cycle-back — by design it can't tell "the walk hit a genuine dead end the flow author simply
  // forgot to flag terminal" apart from "the walk stopped at (or passed through) a step whose real
  // continuation is decided dynamically at runtime" (e.g. CDv2's deployment-pipeline, where a
  // card picks its own next step). Only the SECOND case might genuinely have more steps we can't
  // see statically. `dynamicNext` is the flow author's explicit opt-in for that case. It must be
  // checked along the WHOLE walked-plus-predicted path, not just the step the walk stopped on: a
  // step can carry both a static `next` (so the walk doesn't stop there) AND `dynamicNext: true` —
  // that step's flag would otherwise be silently skipped as the walk continues past it via its
  // static `next`, even though the flag says that continuation isn't the true, final one. Absent
  // the flag anywhere on the path, treat a non-terminal dead end as a real, designed end: trust the
  // walked total instead of inflating it to every configured step/group. This intentionally does
  // NOT change `deriveFullPredictedPath`'s own `reachedKnownEnd` computation
  // (derive-stepper-model.ts) — it's computed here, from data that function already returns, so
  // grouped-mode's stepNumberOverridesComplete (below) can share it.
  const hasDynamicNextOnPath = [activeStepId, ...fullPredictedPath].some(stepId => flow.steps[stepId]?.dynamicNext)
  const pathWalkComplete = reachedKnownEnd || !hasDynamicNextOnPath

  // Flat mode's badge denominator: individual steps already visited plus individual steps still
  // ahead on the run's actual path. When the walk stopped at a step flagged `dynamicNext` (its real
  // continuation is decided at runtime, so more steps may genuinely follow that we can't see
  // statically), never let the denominator collapse below what's already known; fall back to the
  // flow-wide step count instead of undercounting.
  const totalStepsCount = useMemo(() => {
    const walkedTotal = cardHistory.length + fullPredictedPath.length
    if (pathWalkComplete) return walkedTotal
    return Math.max(walkedTotal, Object.keys(flow.steps).length)
  }, [cardHistory.length, fullPredictedPath.length, pathWalkComplete, flow.steps])

  // Per-group numerator for the badge: each group's 1-based position in the ORDER the run
  // actually encounters it (cardHistory first, then the predicted remainder) — not the raw
  // rendering index, which would also count off-path mutually-exclusive sibling groups. Groups
  // never encountered on the run's path (truly off-path siblings) are absent from this map;
  // FlowStepperRail suppresses that group's badge entirely rather than showing a fallback number,
  // since a badge for a path this run never walks would be inherently misleading (see
  // flow-stepper-rail.tsx's stepGroupHasNumber check).
  const stepNumberOverrides = useMemo(() => {
    const seen = new Set<string>()
    const orderedIds: string[] = []
    for (const entry of cardHistory) {
      const stepGroupId = flow.steps[entry.stepId]?.step
      if (stepGroupId && !seen.has(stepGroupId)) {
        seen.add(stepGroupId)
        orderedIds.push(stepGroupId)
      }
    }
    for (const stepId of fullPredictedPath) {
      const stepGroupId = flow.steps[stepId]?.step
      if (stepGroupId && !seen.has(stepGroupId)) {
        seen.add(stepGroupId)
        orderedIds.push(stepGroupId)
      }
    }
    return new Map(orderedIds.map((id, index) => [id, index + 1]))
  }, [cardHistory, fullPredictedPath, flow.steps])

  // Grouped-mode denominator: same fallback-rather-than-undercount rule as totalStepsCount above,
  // one level up (distinct step GROUPS on the run's path, not steps). Derived from
  // stepNumberOverrides.size — not a separate walk — so the numerator (each group's entry in that
  // map) and this denominator can never drift out of sync with each other again. Uses
  // pathWalkComplete (not raw reachedKnownEnd) for the same dynamicNext-aware reason as
  // totalStepsCount above.
  const totalStepGroupsCount = useMemo(() => {
    const walkedTotal = stepNumberOverrides.size
    if (pathWalkComplete) return walkedTotal
    return Math.max(walkedTotal, Object.keys(flow.stepGroups ?? {}).length)
  }, [stepNumberOverrides, pathWalkComplete, flow.stepGroups])

  const totalOverride = flow.stepGroups ? totalStepGroupsCount : totalStepsCount

  const handleStepperClick = (value: string) => {
    const historyEntry = cardHistory.find(e => e.stepId === value)
    if (historyEntry) {
      const isTerminal = historyEntry.status === 'completed' || historyEntry.status === 'skipped'
      const isLastCard = cardHistory[cardHistory.length - 1]?.stepId === historyEntry.stepId
      const isFlowComplete = !cardHistory.some(e => e.status === 'active' || e.status === 'error')
      // Single-pane nested titles share this handler: completed clicks rewind.
      // Dual-pane left rail stays scroll-only (v5 chat stepper only toggles preview).
      if (rewindCompletedClicks && isTerminal && !(isLastCard && isFlowComplete)) {
        requestReactivation(historyEntry.stepId)
        return
      }
      scrollToCard(historyEntry.stepId)
      return
    }
    const firstInStepGroup = cardHistory.find(e => flow.steps[e.stepId]?.step === value)
    if (firstInStepGroup) {
      scrollToCard(firstInStepGroup.stepId)
    }
  }

  return {
    totalOverride,
    stepNumberOverrides,
    stepNumberOverridesComplete: pathWalkComplete,
    handleStepperClick
  }
}
