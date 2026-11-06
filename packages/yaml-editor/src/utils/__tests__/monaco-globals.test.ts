import { describe, expect, it } from 'vitest'

import { MonacoGlobals } from '../monaco-globals'

describe('MonacoGlobals', () => {
  it('stores and returns the globals passed to set()', () => {
    const data = {
      ILanguageFeaturesService: Symbol('svc'),
      OutlineModel: { create: () => undefined },
      StandaloneServices: { get: () => undefined }
    } as unknown as Parameters<typeof MonacoGlobals.set>[0]

    MonacoGlobals.set(data)

    expect(MonacoGlobals.get()).toBe(data)
  })
})
