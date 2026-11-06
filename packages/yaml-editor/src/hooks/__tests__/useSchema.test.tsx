// @vitest-environment jsdom

import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSchema } from '../useSchema'

const addUpdateSchema = vi.fn()
const removeSchema = vi.fn()

// Stub the schema-utils layer (covered by its own unit tests) so we assert only the hook's wiring:
// what it registers on mount and what it tears down on cleanup.
vi.mock('../../utils/schema-utils', () => ({
  addUpdateSchema: (...args: unknown[]) => addUpdateSchema(...args),
  removeSchema: (...args: unknown[]) => removeSchema(...args),
  schemaIdToUrl: (id: string) => `file://${id}`
}))

type Props = Parameters<typeof useSchema>[0]
const Harness = (props: Props) => {
  useSchema(props)
  return null
}

beforeEach(() => {
  addUpdateSchema.mockClear()
  removeSchema.mockClear()
})
afterEach(() => {
  vi.clearAllMocks()
})

describe('useSchema', () => {
  it('registers the schema on mount with a fileMatch derived from the instanceId', () => {
    const schemaConfig = { schema: { type: 'object' }, uri: 'my-uri' }
    render(<Harness schemaConfig={schemaConfig} instanceId="inst-1" />)

    expect(addUpdateSchema).toHaveBeenCalledTimes(1)
    expect(addUpdateSchema).toHaveBeenCalledWith({
      fileMatch: ['file://inst-1'],
      schema: { type: 'object' },
      uri: 'my-uri'
    })
  })

  it('removes the schema on unmount', () => {
    const { unmount } = render(
      <Harness schemaConfig={{ schema: { type: 'object' }, uri: 'my-uri' }} instanceId="inst-1" />
    )

    expect(removeSchema).not.toHaveBeenCalled()
    unmount()
    expect(removeSchema).toHaveBeenCalledWith('inst-1')
  })

  it('does nothing when no schema is provided', () => {
    const { unmount } = render(<Harness instanceId="inst-1" />)

    expect(addUpdateSchema).not.toHaveBeenCalled()
    unmount()
    expect(removeSchema).not.toHaveBeenCalled()
  })
})
