import { decodeURIComponentIfValid, encodeResourcePath, splitPathWithParents } from '../path-utils'

describe('splitPathWithParents', () => {
  it('should return empty array for empty path', () => {
    expect(splitPathWithParents('', 'repo')).toEqual([])
  })

  it('should split single level path correctly', () => {
    const result = splitPathWithParents('file.txt', 'repo')
    expect(result).toEqual([
      {
        path: 'file.txt',
        parentPath: 'repo/~/file.txt'
      }
    ])
  })

  it('should split multi-level path correctly', () => {
    const result = splitPathWithParents('folder/subfolder/file.txt', 'repo')
    expect(result).toEqual([
      {
        path: 'folder',
        parentPath: 'repo/~/folder'
      },
      {
        path: 'subfolder',
        parentPath: 'repo/~/folder/subfolder'
      },
      {
        path: 'file.txt',
        parentPath: 'repo/~/folder/subfolder/file.txt'
      }
    ])
  })

  it('should handle paths with leading slash', () => {
    const result = splitPathWithParents('/folder/file.txt', 'repo')
    expect(result).toEqual([
      {
        path: '',
        parentPath: 'repo/~/'
      },
      {
        path: 'folder',
        parentPath: 'repo/~//folder'
      },
      {
        path: 'file.txt',
        parentPath: 'repo/~//folder/file.txt'
      }
    ])
  })

  it('should handle paths with trailing slash', () => {
    const result = splitPathWithParents('folder/subfolder/', 'repo')
    expect(result).toEqual([
      {
        path: 'folder',
        parentPath: 'repo/~/folder'
      },
      {
        path: 'subfolder',
        parentPath: 'repo/~/folder/subfolder'
      },
      {
        path: '',
        parentPath: 'repo/~/folder/subfolder/'
      }
    ])
  })

  it('should handle special characters in paths', () => {
    const result = splitPathWithParents('folder-name/file_name.txt', 'repo-name')
    expect(result).toEqual([
      {
        path: 'folder-name',
        parentPath: 'repo-name/~/folder-name'
      },
      {
        path: 'file_name.txt',
        parentPath: 'repo-name/~/folder-name/file_name.txt'
      }
    ])
  })
})

describe('encodeResourcePath', () => {
  // Resource names that exercise the encoding edge cases:
  // - `#`      : URL fragment delimiter — must be encoded or the request path is truncated
  // - literal `%` : must survive double-decode without hitting an invalid escape (e.g. `%EF`)
  // - space / `&` / `?` : reserved-ish characters
  // - unicode  : multi-byte encoding
  const SPECIAL_NAMES = ['#test', '#test/#test', 'test%EFRewfs.js', 'a b.txt', '100%done', 'a&b?c', 'café', 'a/b#c.txt']

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

  // ---------------------------------------------------------------------------
  // Scenario 1: `content` API — path travels as a URL PATH SEGMENT.
  //
  //   getContent({ path: encodeResourcePath(name) })
  //     -> url: `/repos/.../content/${path}`
  //     -> backend URL-decodes the path segment TWICE
  //
  // So a correct value must (a) not break URL parsing in the browser, and
  // (b) recover the original name after two decodes.
  // ---------------------------------------------------------------------------
  describe('Scenario 1: content API (path segment, backend double-decode)', () => {
    // Mirror the backend: decode each segment twice.
    const backendDoubleDecode = (encoded: string) =>
      encoded
        .split('/')
        .map(segment => decodeURIComponent(decodeURIComponent(segment)))
        .join('/')

    // Regression: a `#`-prefixed folder was sent raw, the browser treated `#…`
    // as the URL fragment, the request silently resolved to the repo root, and
    // the file tree rendered the same folder recursively forever.
    it('should not truncate the request pathname (no fragment) for `#` names', () => {
      const resolved = new URL(`/repos/org/repo/content/${encodeResourcePath('#test/#test')}`, 'http://localhost')
      expect(resolved.pathname).toBe('/repos/org/repo/content/%2523test/%2523test')
      expect(resolved.hash).toBe('')
    })

    // Regression: `test%EFRewfs.js` single-encoded is `test%25EFRewfs.js`, whose
    // second backend decode hits the invalid `%EF` escape and returns 500.
    // Double-encoding (`test%2525EFRewfs.js`) decodes cleanly to the original.
    it('should let a literal `%` survive the double-decode (no 500)', () => {
      expect(backendDoubleDecode(encodeResourcePath('test%EFRewfs.js'))).toBe('test%EFRewfs.js')
    })

    it('should round-trip every special name through the backend double-decode', () => {
      for (const name of SPECIAL_NAMES) {
        expect(backendDoubleDecode(encodeResourcePath(name))).toBe(name)
      }
    })
  })

  // ---------------------------------------------------------------------------
  // Scenario 2: `listCommits` API — path travels as a QUERY PARAM.
  //
  //   encodeResourcePath(name) is written into location.pathname (the link),
  //   read back raw by useCodePathDetails, then the read sites
  //   (file-content-viewer / file-editor) double-decode it before passing it to
  //   listCommits, where qs.stringify re-encodes the value ONCE and the backend
  //   decodes the query param ONCE.
  //
  //   write:  name --encodeResourcePath(double)--> location.pathname
  //   read:   pathname --double-decode--> name
  //   wire:   name --qs(single-encode)--> ?path=...
  //   server: ?path=... --single-decode--> name
  //
  // The net effect must be the original name on the server side.
  // ---------------------------------------------------------------------------
  describe('Scenario 2: listCommits API (query param, double-decode then single re-encode)', () => {
    const decodeURIComponentIfValidLocal = (s: string) => {
      try {
        return decodeURIComponent(s)
      } catch {
        return s
      }
    }
    // The read sites do: decodeURIComponentIfValid(decodeURIComponentIfValid(x))
    const readSiteDoubleDecode = (s: string) => decodeURIComponentIfValidLocal(decodeURIComponentIfValidLocal(s))

    // qs.stringify encodes a query VALUE with encodeURIComponent; the backend
    // then decodes the query param once. We model that round-trip here.
    const qsEncodeValue = (s: string) => encodeURIComponent(s)
    const backendSingleDecode = (s: string) => decodeURIComponent(s)

    it('should net to the original name on the wire for special characters', () => {
      for (const name of SPECIAL_NAMES) {
        // 1. link written into the URL
        const inUrl = encodeResourcePath(name)
        // 2. useCodePathDetails reads location.pathname raw (no decode)
        const fullResourcePath = inUrl
        // 3. read sites double-decode before calling listCommits
        const decodedForQuery = readSiteDoubleDecode(fullResourcePath)
        // 4. qs re-encodes the value, 5. backend decodes once
        const backendSees = backendSingleDecode(qsEncodeValue(decodedForQuery))
        expect(backendSees).toBe(name)
      }
    })

    it('should double-decode back to plaintext before the query is built', () => {
      expect(readSiteDoubleDecode(encodeResourcePath('#test'))).toBe('#test')
      expect(readSiteDoubleDecode(encodeResourcePath('test%EFRewfs.js'))).toBe('test%EFRewfs.js')
    })
  })
})

describe('decodeURIComponentIfValid', () => {
  it('should decode a valid URI component', () => {
    const result = decodeURIComponentIfValid('folder%20name/file%20name.txt')
    expect(result).toBe('folder name/file name.txt')
  })

  it('should return the original string if it is not a valid URI component', () => {
    const result = decodeURIComponentIfValid('%E0%A4%A')
    expect(result).toBe('%E0%A4%A')
  })

  it('should return the original string if there is nothing to decode', () => {
    const result = decodeURIComponentIfValid('folder-name/file-name.txt')
    expect(result).toBe('folder-name/file-name.txt')
  })

  it('should handle empty string', () => {
    const result = decodeURIComponentIfValid('')
    expect(result).toBe('')
  })
})
