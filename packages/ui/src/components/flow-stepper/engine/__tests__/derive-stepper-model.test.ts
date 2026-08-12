import { describe, expect, test } from 'vitest'

import { deriveFlatStepperModel, deriveFullPredictedPath, deriveStepperModel } from '../derive-stepper-model'
import type { CardEntry, FlowConfig } from '../engine-types'

const flow: FlowConfig = {
  stepGroups: { s1: { title: 'Step 1' }, s2: { title: 'Step 2' } },
  steps: {
    a: { step: 's1', title: 'A', component: () => null, next: 'b' },
    b: { step: 's1', title: 'B', component: () => null, next: 'c' },
    c: { step: 's2', title: 'C', component: () => null }
  },
  initialStep: 'a'
}

describe('deriveStepperModel', () => {
  test('first step active, second upcoming; predicted fills active step', () => {
    const history: CardEntry[] = [{ stepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flow, history, ['b'], 'a')
    expect(model.map(s => [s.stepGroupId, s.state])).toEqual([
      ['s1', 'active'],
      ['s2', 'upcoming']
    ])
    expect(model[0].predicted).toEqual(['b'])
    expect(model[0].visited).toEqual([{ stepId: 'a', state: 'active' }])
  })

  test('completed first step shows completed; visited carries statuses', () => {
    const history: CardEntry[] = [
      { stepId: 'a', status: 'completed', stateSnapshot: {} },
      { stepId: 'b', status: 'completed', stateSnapshot: {} },
      { stepId: 'c', status: 'active', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'c')
    expect(model[0].state).toBe('completed')
    expect(model[0].visited).toEqual([
      { stepId: 'a', state: 'completed' },
      { stepId: 'b', state: 'completed' }
    ])
    expect(model[1].state).toBe('active')
    expect(model[1].visited).toEqual([{ stepId: 'c', state: 'active' }])
  })

  test('error status on a visited step marks its step group error', () => {
    const history: CardEntry[] = [{ stepId: 'a', status: 'error', stateSnapshot: {} }]
    const model = deriveStepperModel(flow, history, [], 'a')
    expect(model[0].state).toBe('error')
    expect(model[0].visited).toEqual([{ stepId: 'a', state: 'error' }])
  })

  test('recovered error (error then a later step completed) marks the STEP GROUP completed, step stays error', () => {
    // a errored, but the flow continued to b which completed — the step group recovered.
    const history: CardEntry[] = [
      { stepId: 'a', status: 'error', stateSnapshot: {} },
      { stepId: 'b', status: 'completed', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'b')
    // Step group s1 is completed (recovered), NOT error — the error is not the trailing/unresolved state.
    expect(model[0].state).toBe('completed')
    // The individual errored step still renders red in the timeline.
    expect(model[0].visited).toEqual([
      { stepId: 'a', state: 'error' },
      { stepId: 'b', state: 'completed' }
    ])
    // No indeterminate "..." placeholder on a resolved step group.
    expect(model[0].showIndeterminate).toBe(false)
  })

  test('trailing/unresolved error still marks the step group error', () => {
    // a completed, b errored and is the last visited step — the step group is stopped on the error.
    const history: CardEntry[] = [
      { stepId: 'a', status: 'completed', stateSnapshot: {} },
      { stepId: 'b', status: 'error', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'b')
    expect(model[0].state).toBe('error')
  })

  test('skipped step in history is included in visited with skipped state', () => {
    const history: CardEntry[] = [
      { stepId: 'a', status: 'skipped', stateSnapshot: {} },
      { stepId: 'c', status: 'active', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'c')
    expect(model[0].state).toBe('completed') // all steps completed or skipped = completed
    expect(model[0].visited).toEqual([{ stepId: 'a', state: 'skipped' }])
  })

  test('isTerminalStepGroup is true when step group has no steps', () => {
    const flowWithTerminal: FlowConfig = {
      stepGroups: { s1: { title: 'Step 1' }, s2: { title: 'Step 2 (terminal)' } },
      steps: {
        a: { step: 's1', title: 'A', component: () => null }
      },
      initialStep: 'a'
    }
    const history: CardEntry[] = [{ stepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flowWithTerminal, history, [], 'a')
    expect(model[0].isTerminalStepGroup).toBe(false)
    expect(model[1].isTerminalStepGroup).toBe(true)
  })

  test('showIndeterminate is true when active step group has no next and no predicted steps', () => {
    const flowWithNoNext: FlowConfig = {
      stepGroups: { s1: { title: 'Step 1' } },
      steps: {
        a: { step: 's1', title: 'A', component: () => null } // no next
      },
      initialStep: 'a'
    }
    const history: CardEntry[] = [{ stepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flowWithNoNext, history, [], 'a')
    expect(model[0].showIndeterminate).toBe(true)
  })

  test('showIndeterminate is false when predicted steps exist', () => {
    const history: CardEntry[] = [{ stepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flow, history, ['b'], 'a')
    expect(model[0].showIndeterminate).toBe(false)
  })

  test('flow complete and all steps completed marks step group as completed', () => {
    const history: CardEntry[] = [
      { stepId: 'a', status: 'completed', stateSnapshot: {} },
      { stepId: 'b', status: 'completed', stateSnapshot: {} },
      { stepId: 'c', status: 'completed', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'c')
    expect(model[0].state).toBe('completed')
    expect(model[1].state).toBe('completed')
  })

  test('visualCompleted active step marks its step group completed even though it is still active', () => {
    const flowWithVisualCompleted: FlowConfig = {
      stepGroups: { s1: { title: 'Step 1' }, s2: { title: 'Step 2' } },
      steps: {
        x: { step: 's1', title: 'X', component: () => null, next: 'y' },
        y: { step: 's2', title: 'Y', component: () => null, terminal: true, visualCompleted: true }
      },
      initialStep: 'x'
    }
    const history: CardEntry[] = [
      { stepId: 'x', status: 'completed', stateSnapshot: {} },
      { stepId: 'y', status: 'active', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flowWithVisualCompleted, history, [], 'y')
    // Step group s2 is completed for RENDERING purposes even though its only step's real
    // cardHistory status is still 'active' (terminal steps never leave 'active' once the
    // engine's re-entry guard has been hit — see Task 2).
    expect(model[1].state).toBe('completed')
    // The visited entry's OWN state is untouched — still 'active'. Display override for the
    // step icon/color is stepper-step.tsx's job (Task 4), not this function's.
    expect(model[1].visited).toEqual([{ stepId: 'y', state: 'active' }])
  })

  test('active step without visualCompleted stays active (no regression)', () => {
    const history: CardEntry[] = [{ stepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flow, history, ['b'], 'a')
    expect(model[0].state).toBe('active')
  })
})

describe('deriveFullPredictedPath', () => {
  test('linear flow: walks every remaining step to the end, same as a single-branch flow would', () => {
    // No branching here — the full remaining path is just b then c.
    const history: CardEntry[] = [{ stepId: 'a', status: 'active', stateSnapshot: {} }]
    const result = deriveFullPredictedPath(flow, history, 'a')
    expect(result.path).toEqual(['b', 'c'])
    expect(result.reachedKnownEnd).toBe(true)
  })

  test('branching flow: only walks the ACTIVE branch, not every mutually-exclusive sibling step', () => {
    // Mirrors the shape of a real branching flow (e.g. mutually-exclusive auth-provider steps that
    // all converge on a shared next step): step group "auth" has 3 mutually-exclusive entry steps
    // that all point at the same "connect" step, which is the only one actually on any given run's
    // path alongside whichever single auth step the user picked.
    const branchingFlow: FlowConfig = {
      stepGroups: { auth: { title: 'Auth' }, connect: { title: 'Connect' }, done: { title: 'Done' } },
      steps: {
        'github-auth': { step: 'auth', title: 'GitHub', component: () => null, next: 'connect-repo' },
        'gitlab-auth': { step: 'auth', title: 'GitLab', component: () => null, next: 'connect-repo' },
        'bitbucket-auth': { step: 'auth', title: 'Bitbucket', component: () => null, next: 'connect-repo' },
        'connect-repo': { step: 'connect', title: 'Connect', component: () => null, next: 'finish' },
        finish: { step: 'done', title: 'Finish', component: () => null }
      },
      initialStep: 'github-auth'
    }
    const history: CardEntry[] = [{ stepId: 'github-auth', status: 'active', stateSnapshot: {} }]
    // Only the steps on the github-auth branch's path are walked — gitlab-auth/bitbucket-auth
    // (the unchosen sibling branches) never appear, even though they exist in flow.steps.
    const result = deriveFullPredictedPath(branchingFlow, history, 'github-auth')
    expect(result.path).toEqual(['connect-repo', 'finish'])
    expect(result.reachedKnownEnd).toBe(true)
  })

  test('branching flow: walks across step-group boundaries, unlike the group-scoped predictedPath', () => {
    // Same branching flow as above, but from the active step "connect-repo" — the remaining path
    // crosses into the "done" step group. deriveFullPredictedPath must NOT stop there (that's the
    // group-scoped behavior reserved for engine-context.tsx's own predictedPath).
    const branchingFlow: FlowConfig = {
      stepGroups: { auth: { title: 'Auth' }, connect: { title: 'Connect' }, done: { title: 'Done' } },
      steps: {
        'github-auth': { step: 'auth', title: 'GitHub', component: () => null, next: 'connect-repo' },
        'connect-repo': { step: 'connect', title: 'Connect', component: () => null, next: 'finish' },
        finish: { step: 'done', title: 'Finish', component: () => null }
      },
      initialStep: 'github-auth'
    }
    const history: CardEntry[] = [
      { stepId: 'github-auth', status: 'completed', stateSnapshot: {} },
      { stepId: 'connect-repo', status: 'active', stateSnapshot: {} }
    ]
    const result = deriveFullPredictedPath(branchingFlow, history, 'connect-repo')
    expect(result.path).toEqual(['finish'])
    expect(result.reachedKnownEnd).toBe(true)
  })

  test('stops at a step already in cardHistory (cycle guard) rather than looping forever', () => {
    const cyclicFlow: FlowConfig = {
      stepGroups: { s1: { title: 'S1' } },
      steps: {
        a: { step: 's1', title: 'A', component: () => null, next: 'b' },
        b: { step: 's1', title: 'B', component: () => null, next: 'a' } // misconfigured cycle back to a
      },
      initialStep: 'a'
    }
    const history: CardEntry[] = [{ stepId: 'a', status: 'active', stateSnapshot: {} }]
    // Walks to b, then next would be a — but a is already in cardHistory, so it stops instead of
    // looping forever.
    const result = deriveFullPredictedPath(cyclicFlow, history, 'a')
    expect(result.path).toEqual(['b'])
    expect(result.reachedKnownEnd).toBe(true)
  })

  test('active step has a static next that loops directly back to an already-visited step: empty path is a confirmed loop-back, not an unknown destination (reachedKnownEnd true)', () => {
    const loopBackFlow: FlowConfig = {
      stepGroups: { s1: { title: 'S1' } },
      steps: {
        'choose-provider': { step: 's1', title: 'Choose provider', component: () => null, next: 'connect' },
        connect: { step: 's1', title: 'Connect', component: () => null, next: 'connection-failed' },
        'connection-failed': {
          step: 's1',
          title: 'Connection failed',
          component: () => null,
          next: 'choose-provider' // loops back to an already-visited step
        }
      },
      initialStep: 'choose-provider'
    }
    const history: CardEntry[] = [
      { stepId: 'choose-provider', status: 'completed', stateSnapshot: {} },
      { stepId: 'connect', status: 'error', stateSnapshot: {} }
    ]
    // 'connection-failed's next ('choose-provider') is already visited, so the walk stops
    // immediately and path is empty — but this IS a known destination (a real loop-back), not an
    // ambiguous dynamic choice, so reachedKnownEnd must stay true.
    const result = deriveFullPredictedPath(loopBackFlow, history, 'connection-failed')
    expect(result.path).toEqual([])
    expect(result.reachedKnownEnd).toBe(true)
  })

  test('returns empty path and reachedKnownEnd=false when the active step has no static next and is not flagged terminal (ambiguous — could be a dynamic-choice step)', () => {
    const history: CardEntry[] = [{ stepId: 'c', status: 'active', stateSnapshot: {} }]
    const result = deriveFullPredictedPath(flow, history, 'c')
    expect(result.path).toEqual([])
    expect(result.reachedKnownEnd).toBe(false)
  })

  test('active step explicitly flagged terminal with no next is confirmed as the known end (reachedKnownEnd true)', () => {
    const flowWithTerminalEnd: FlowConfig = {
      stepGroups: { s1: { title: 'S1' } },
      steps: {
        done: { step: 's1', title: 'Done', component: () => null, terminal: true }
      },
      initialStep: 'done'
    }
    const history: CardEntry[] = [{ stepId: 'done', status: 'active', stateSnapshot: {} }]
    const result = deriveFullPredictedPath(flowWithTerminalEnd, history, 'done')
    expect(result.path).toEqual([])
    expect(result.reachedKnownEnd).toBe(true)
  })

  test('active step with no static next and not flagged terminal is ambiguous (reachedKnownEnd false) — its real destination may be decided dynamically by complete(statePatch, nextStepId)', () => {
    const dynamicChoiceFlow: FlowConfig = {
      stepGroups: { choice: { title: 'Choice' }, next: { title: 'Next' } },
      steps: {
        pick: { step: 'choice', title: 'Pick', component: () => null }, // no static next — dynamic
        'landing-a': { step: 'next', title: 'Landing A', component: () => null },
        'landing-b': { step: 'next', title: 'Landing B', component: () => null }
      },
      initialStep: 'pick'
    }
    const history: CardEntry[] = [{ stepId: 'pick', status: 'active', stateSnapshot: {} }]
    const result = deriveFullPredictedPath(dynamicChoiceFlow, history, 'pick')
    expect(result.path).toEqual([])
    expect(result.reachedKnownEnd).toBe(false)
  })

  test('genuine static cycle among steps NOT in cardHistory does not hang (cycle guard updates as it walks)', () => {
    // Neither 'a' nor 'b' is in cardHistory — only the pre-fix seed-once-from-cardHistory guard
    // would miss this cycle and loop forever. With the fix (visited.add inside the loop), the walk
    // terminates as soon as it re-enters a step it already pushed this call.
    const cyclicFlow: FlowConfig = {
      stepGroups: { s1: { title: 'S1' } },
      steps: {
        start: { step: 's1', title: 'Start', component: () => null, next: 'a' },
        a: { step: 's1', title: 'A', component: () => null, next: 'b' },
        b: { step: 's1', title: 'B', component: () => null, next: 'a' } // cycle a <-> b
      },
      initialStep: 'start'
    }
    const history: CardEntry[] = [{ stepId: 'start', status: 'active', stateSnapshot: {} }]
    const result = deriveFullPredictedPath(cyclicFlow, history, 'start')
    expect(result.path).toEqual(['a', 'b'])
    expect(result.reachedKnownEnd).toBe(true)
  })
})

describe('deriveFlatStepperModel', () => {
  const flatFlow: FlowConfig = {
    steps: {
      a: { title: 'A', component: () => null, next: 'b' },
      b: { title: 'B', component: () => null, next: 'c' },
      c: { title: 'C', component: () => null }
    },
    initialStep: 'a'
  }

  test('visited step shows completed; active step shows active; unreached steps on static path show upcoming', () => {
    const history: CardEntry[] = [
      { stepId: 'a', status: 'completed', stateSnapshot: {} },
      { stepId: 'b', status: 'active', stateSnapshot: {} }
    ]
    const result = deriveFlatStepperModel(flatFlow, history, 'b')
    expect(result).toEqual([
      { stepId: 'a', title: 'A', description: undefined, state: 'completed', visualCompleted: false },
      { stepId: 'b', title: 'B', description: undefined, state: 'active', visualCompleted: false },
      { stepId: 'c', title: 'C', description: undefined, state: 'upcoming', visualCompleted: false }
    ])
  })

  test('error status on active step marks it error', () => {
    const history: CardEntry[] = [{ stepId: 'a', status: 'error', stateSnapshot: {} }]
    const result = deriveFlatStepperModel(flatFlow, history, 'a')
    expect(result[0]).toEqual({
      stepId: 'a',
      title: 'A',
      description: undefined,
      state: 'error',
      visualCompleted: false
    })
  })

  test('flow complete: all steps completed marks visited step completed, not active', () => {
    const history: CardEntry[] = [
      { stepId: 'a', status: 'completed', stateSnapshot: {} },
      { stepId: 'b', status: 'completed', stateSnapshot: {} },
      { stepId: 'c', status: 'completed', stateSnapshot: {} }
    ]
    const result = deriveFlatStepperModel(flatFlow, history, 'c')
    expect(result).toEqual([
      { stepId: 'a', title: 'A', description: undefined, state: 'completed', visualCompleted: false },
      { stepId: 'b', title: 'B', description: undefined, state: 'completed', visualCompleted: false },
      { stepId: 'c', title: 'C', description: undefined, state: 'completed', visualCompleted: false }
    ])
  })

  test('terminal + visualCompleted step renders completed, not active, despite always-active cardHistory status', () => {
    const terminalFlow: FlowConfig = {
      steps: {
        x: { title: 'X', component: () => null, next: 'y' },
        y: { title: 'Y', component: () => null, terminal: true, visualCompleted: true }
      },
      initialStep: 'x'
    }
    const history: CardEntry[] = [
      { stepId: 'x', status: 'completed', stateSnapshot: {} },
      { stepId: 'y', status: 'active', stateSnapshot: {} }
    ]
    const result = deriveFlatStepperModel(terminalFlow, history, 'y')
    expect(result).toEqual([
      { stepId: 'x', title: 'X', description: undefined, state: 'completed', visualCompleted: false },
      { stepId: 'y', title: 'Y', description: undefined, state: 'completed', visualCompleted: true }
    ])
  })

  test('active step without visualCompleted stays active (no regression on the terminal case above)', () => {
    const terminalFlow: FlowConfig = {
      steps: {
        x: { title: 'X', component: () => null, next: 'y' },
        y: { title: 'Y', component: () => null, terminal: true }
      },
      initialStep: 'x'
    }
    const history: CardEntry[] = [
      { stepId: 'x', status: 'completed', stateSnapshot: {} },
      { stepId: 'y', status: 'active', stateSnapshot: {} }
    ]
    const result = deriveFlatStepperModel(terminalFlow, history, 'y')
    expect(result[1]).toEqual({
      stepId: 'y',
      title: 'Y',
      description: undefined,
      state: 'active',
      visualCompleted: false
    })
  })

  test('CDv2-shaped single dynamic-choice step renders active with no visualCompleted', () => {
    const cdv2ShapedFlow: FlowConfig = {
      steps: {
        pick: { title: 'Pick', component: () => null },
        'landing-a': { title: 'Landing A', component: () => null },
        'landing-b': { title: 'Landing B', component: () => null }
      },
      initialStep: 'pick'
    }
    const history: CardEntry[] = [{ stepId: 'pick', status: 'active', stateSnapshot: {} }]
    const result = deriveFlatStepperModel(cdv2ShapedFlow, history, 'pick')
    expect(result).toEqual([
      { stepId: 'pick', title: 'Pick', description: undefined, state: 'active', visualCompleted: false }
    ])
  })
})
