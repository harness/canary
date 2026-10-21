import { preserveCssUnicodeEscapes } from './preserve-css-unicode-escapes'

describe('preserveCssUnicodeEscapes', () => {
  test('rewrites a literal ZWSP in content to a CSS escape', () => {
    const input = '.cn-skeleton-typography-child:before{content:"\u200B"}'
    const output = preserveCssUnicodeEscapes(input)

    expect(output).toBe('.cn-skeleton-typography-child:before{content:"\\200B"}')
    expect(Buffer.from(output).includes(Buffer.from([0xe2, 0x80, 0x8b]))).toBe(false)
    expect(output.includes('\\200B')).toBe(true)
  })

  test('leaves already-escaped CSS unchanged', () => {
    const input = '.cn-skeleton-typography-child:before{content:"\\200B"}'
    expect(preserveCssUnicodeEscapes(input)).toBe(input)
  })
})
