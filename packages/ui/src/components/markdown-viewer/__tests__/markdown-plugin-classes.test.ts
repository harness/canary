import { defaultSchema } from 'rehype-sanitize'
import { describe, expect, it } from 'vitest'

import { applyAllowedClasses } from '../markdown-plugin-classes'

describe('applyAllowedClasses', () => {
  const attributes = {
    ...(defaultSchema.attributes || {}),
    div: [...(defaultSchema.attributes?.div || []), 'className'],
    p: [...(defaultSchema.attributes?.p || []), 'className']
  }

  it('extends a named class list and keeps the names already allowed', () => {
    const next = applyAllowedClasses(attributes, [
      { allowedClasses: { li: ['bg-cn-diff-success'], h2: ['bg-cn-diff-danger'] } }
    ])

    expect(next.li).toEqual([['className', 'task-list-item', 'bg-cn-diff-success']])
    expect(next.h2).toEqual([['className', 'sr-only', 'bg-cn-diff-danger']])
  })

  it('unions classes declared by more than one plugin', () => {
    const next = applyAllowedClasses(attributes, [
      { allowedClasses: { span: ['custom-mark'] } },
      { allowedClasses: { span: ['custom-mark', 'other-mark'], pre: ['bg-cn-diff-success'] } }
    ])

    expect(next.span).toEqual([['className', 'custom-mark', 'other-mark']])
    expect(next.pre).toEqual([['className', 'bg-cn-diff-success']])
  })

  it('leaves a tag that already allows every class unchanged', () => {
    const next = applyAllowedClasses(attributes, [{ allowedClasses: { p: ['bg-cn-diff-success'] } }])

    expect(next.p).toEqual([...(defaultSchema.attributes?.p || []), 'className'])
  })

  it('adds nothing when no plugin declares classes', () => {
    expect(applyAllowedClasses(attributes, [undefined, {}])).toEqual(attributes)
  })

  it('keeps an existing class pattern when a plugin adds a class name', () => {
    const next = applyAllowedClasses(attributes, [{ allowedClasses: { code: ['custom-mark'] } }])
    const rule = next.code?.find((entry): entry is unknown[] => Array.isArray(entry) && entry[0] === 'className')

    expect(rule?.[1]).toBeInstanceOf(RegExp)
    expect(rule).toContain('custom-mark')
  })
})
