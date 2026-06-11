import { encodeResourcePath } from '../utils'

describe('encodeResourcePath', () => {
  // The `content` backend URL-decodes the path segment TWICE, so each segment is
  // double-encoded. Mirror the backend here: decode each segment twice.
  const backendDoubleDecode = (encoded: string) =>
    encoded
      .split('/')
      .map(segment => decodeURIComponent(decodeURIComponent(segment)))
      .join('/')

  it('should return empty string for undefined', () => {
    expect(encodeResourcePath(undefined)).toBe('')
  })

  it('should return empty string for empty path', () => {
    expect(encodeResourcePath('')).toBe('')
  })

  it('should preserve slashes between segments', () => {
    expect(encodeResourcePath('folder/subfolder/file.txt')).toBe('folder/subfolder/file.txt')
  })

  it('should double-encode each segment with encodeURIComponent', () => {
    expect(encodeResourcePath('#test')).toBe('%2523test')
    expect(encodeResourcePath('#test/#test')).toBe('%2523test/%2523test')
    expect(encodeResourcePath('test%EFRewfs.js')).toBe('test%2525EFRewfs.js')
  })

  // Regression: file list view (Summary) built links with the old `encodePath`
  // (encodeURI), which leaves `#` untouched. The browser then read `#…` as the
  // URL fragment, truncating the link so clicking a `#`-folder did nothing.
  it('should not truncate the request pathname (no fragment) for `#` names', () => {
    const resolved = new URL(`/repos/org/repo/content/${encodeResourcePath('#test/#test')}`, 'http://localhost')
    expect(resolved.pathname).toBe('/repos/org/repo/content/%2523test/%2523test')
    expect(resolved.hash).toBe('')
  })

  it('should round-trip every special name through the backend double-decode', () => {
    const names = ['#test', '#test/#test', 'test%EFRewfs.js', 'a b.txt', '100%done', 'a&b?c', 'café', 'a/b#c.txt']
    for (const name of names) {
      expect(backendDoubleDecode(encodeResourcePath(name))).toBe(name)
    }
  })
})
