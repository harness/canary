import { describe, expect, test } from 'vitest'

import { deriveStepperModel } from '../derive-stepper-model'
import type { CardEntry, FlowConfig } from '../engine-types'

const flow: FlowConfig = {
  steps: { s1: { title: 'Step 1' }, s2: { title: 'Step 2' } },
  subSteps: {
    a: { step: 's1', title: 'A', component: () => null, next: 'b' },
    b: { step: 's1', title: 'B', component: () => null, next: 'c' },
    c: { step: 's2', title: 'C', component: () => null }
  },
  initialSubStep: 'a'
}

describe('deriveStepperModel', () => {
  test('first step active, second upcoming; predicted fills active step', () => {
    const history: CardEntry[] = [{ subStepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flow, history, ['b'], 'a')
    expect(model.map(s => [s.stepId, s.state])).toEqual([
      ['s1', 'active'],
      ['s2', 'upcoming']
    ])
    expect(model[0].predicted).toEqual(['b'])
    expect(model[0].visited).toEqual([{ subStepId: 'a', state: 'active' }])
  })

  test('completed first step shows completed; visited carries statuses', () => {
    const history: CardEntry[] = [
      { subStepId: 'a', status: 'completed', stateSnapshot: {} },
      { subStepId: 'b', status: 'completed', stateSnapshot: {} },
      { subStepId: 'c', status: 'active', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'c')
    expect(model[0].state).toBe('completed')
    expect(model[0].visited).toEqual([
      { subStepId: 'a', state: 'completed' },
      { subStepId: 'b', state: 'completed' }
    ])
    expect(model[1].state).toBe('active')
    expect(model[1].visited).toEqual([{ subStepId: 'c', state: 'active' }])
  })

  test('error status on a visited substep marks its step error', () => {
    const history: CardEntry[] = [{ subStepId: 'a', status: 'error', stateSnapshot: {} }]
    const model = deriveStepperModel(flow, history, [], 'a')
    expect(model[0].state).toBe('error')
    expect(model[0].visited).toEqual([{ subStepId: 'a', state: 'error' }])
  })

  test('skipped substep in history is included in visited with skipped state', () => {
    const history: CardEntry[] = [
      { subStepId: 'a', status: 'skipped', stateSnapshot: {} },
      { subStepId: 'c', status: 'active', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'c')
    expect(model[0].state).toBe('completed') // all substeps completed or skipped = completed
    expect(model[0].visited).toEqual([{ subStepId: 'a', state: 'skipped' }])
  })

  test('isTerminalStep is true when step has no substeps', () => {
    const flowWithTerminal: FlowConfig = {
      steps: { s1: { title: 'Step 1' }, s2: { title: 'Step 2 (terminal)' } },
      subSteps: {
        a: { step: 's1', title: 'A', component: () => null }
      },
      initialSubStep: 'a'
    }
    const history: CardEntry[] = [{ subStepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flowWithTerminal, history, [], 'a')
    expect(model[0].isTerminalStep).toBe(false)
    expect(model[1].isTerminalStep).toBe(true)
  })

  test('showIndeterminate is true when active step has no next and no predicted substeps', () => {
    const flowWithNoNext: FlowConfig = {
      steps: { s1: { title: 'Step 1' } },
      subSteps: {
        a: { step: 's1', title: 'A', component: () => null } // no next
      },
      initialSubStep: 'a'
    }
    const history: CardEntry[] = [{ subStepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flowWithNoNext, history, [], 'a')
    expect(model[0].showIndeterminate).toBe(true)
  })

  test('showIndeterminate is false when predicted substeps exist', () => {
    const history: CardEntry[] = [{ subStepId: 'a', status: 'active', stateSnapshot: {} }]
    const model = deriveStepperModel(flow, history, ['b'], 'a')
    expect(model[0].showIndeterminate).toBe(false)
  })

  test('flow complete and all substeps completed marks step as completed', () => {
    const history: CardEntry[] = [
      { subStepId: 'a', status: 'completed', stateSnapshot: {} },
      { subStepId: 'b', status: 'completed', stateSnapshot: {} },
      { subStepId: 'c', status: 'completed', stateSnapshot: {} }
    ]
    const model = deriveStepperModel(flow, history, [], 'c')
    expect(model[0].state).toBe('completed')
    expect(model[1].state).toBe('completed')
  })
})
