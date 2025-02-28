import langMap from 'lang-map'

import {
  decodeGitContent,
  filenameToLanguage,
  formatBytes,
  getTrimmedSha,
  GitCommitAction,
  isGitRev,
  isRefABranch,
  isRefATag,
  normalizeGitRef,
  REFS_BRANCH_PREFIX,
  REFS_TAGS_PREFIX
} from '../git-utils'

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('should handle decimal places correctly', () => {
    expect(formatBytes(1234, 1)).toBe('1.2 KB')
    expect(formatBytes(1234, 0)).toBe('1 KB')
    expect(formatBytes(1234, 3)).toBe('1.205 KB')
  })

  it('should handle negative decimals', () => {
    expect(formatBytes(1234, -1)).toBe('1 KB')
  })
})

describe('decodeGitContent', () => {
  let mockConsoleError: ReturnType<typeof vi.spyOn>
  let mockAtob: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Spy on console.error
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Spy on window.atob with explicit parameter/return signatures
    mockAtob = vi
      .spyOn(window, 'atob')
      .mockImplementation((str: unknown) => Buffer.from(str as string, 'base64').toString()) as never
  })

  afterEach(() => {
    mockConsoleError.mockRestore()
  })

  it('should decode base64 content correctly', () => {
    const base64Content = Buffer.from('Hello World').toString('base64')
    expect(decodeGitContent(base64Content)).toBe('Hello World')
  })

  it('should handle empty content', () => {
    expect(decodeGitContent()).toBe('')
    expect(decodeGitContent('')).toBe('')
  })

  it('should handle invalid base64 content', () => {
    expect(decodeGitContent('invalid-base64')).toBe('invalid-base64')
  })

  it('should handle decoding errors', () => {
    mockAtob.mockImplementation(() => {
      throw new Error('Decoding error')
    })
    expect(decodeGitContent('error-content')).toBe('error-content')
  })
})

describe('filenameToLanguage', () => {
  const mockLanguagesMap = new Map<string, string[]>([
    ['js', ['javascript']],
    ['py', ['python']],
    ['go', ['go']],
    ['ts', ['typescript']]
  ])

  const mockLanguages = vi.spyOn(langMap, 'languages')

  beforeEach(() => {
    // Mock the langMap.languages function
    mockLanguages.mockImplementation(ext => mockLanguagesMap.get(ext) || [])
  })

  afterEach(() => {
    mockLanguages.mockRestore()
  })

  it('should detect common file extensions', () => {
    expect(filenameToLanguage('test.js')).toBe('javascript')
    expect(filenameToLanguage('test.py')).toBe('python')
    expect(filenameToLanguage('test.go')).toBe('go')
    expect(filenameToLanguage('test.ts')).toBe('typescript')
  })

  it('should map special extensions correctly', () => {
    expect(filenameToLanguage('test.jsx')).toBe('typescript')
    expect(filenameToLanguage('test.tsx')).toBe('typescript')
    expect(filenameToLanguage('.gitignore')).toBe('shell')
    expect(filenameToLanguage('Dockerfile')).toBe('dockerfile')
  })

  it('should handle extensions from lang-map that match Monaco supported languages', () => {
    expect(filenameToLanguage('test.custom')).toBe('plaintext')
  })

  it('should return plaintext for unknown extensions', () => {
    expect(filenameToLanguage('test.unknown')).toBe('plaintext')
    expect(filenameToLanguage('')).toBe('plaintext')
    expect(filenameToLanguage(undefined)).toBe('plaintext')
  })
})

describe('Git Reference Functions', () => {
  describe('isRefATag', () => {
    it('should identify tag references', () => {
      expect(isRefATag(REFS_TAGS_PREFIX + 'v1.0.0')).toBe(true)
      expect(isRefATag('v1.0.0')).toBe(false)
      expect(isRefATag(undefined)).toBe(false)
    })
  })

  describe('isRefABranch', () => {
    it('should identify branch references', () => {
      expect(isRefABranch(REFS_BRANCH_PREFIX + 'main')).toBe(true)
      expect(isRefABranch('main')).toBe(false)
      expect(isRefABranch(undefined)).toBe(false)
    })
  })

  describe('isGitRev', () => {
    it('should identify valid git commit hashes', () => {
      expect(isGitRev('1234567')).toBe(true)
      expect(isGitRev('1234567890abcdef1234567890abcdef12345678')).toBe(true)
      expect(isGitRev('123456')).toBe(false) // Too short
      expect(isGitRev('123456g')).toBe(false) // Invalid character
      expect(isGitRev('')).toBe(false)
    })
  })

  describe('normalizeGitRef', () => {
    it('should handle undefined input', () => {
      expect(normalizeGitRef(undefined)).toBe('refs/heads/undefined')
    })

    it('should normalize git references correctly', () => {
      const tag = REFS_TAGS_PREFIX + 'v1.0.0'
      const branch = REFS_BRANCH_PREFIX + 'main'
      const commit = '1234567890abcdef1234567890abcdef12345678'

      expect(normalizeGitRef(tag)).toBe(tag)
      expect(normalizeGitRef(branch)).toBe(branch)
      expect(normalizeGitRef(commit)).toBe(commit)
      expect(normalizeGitRef('main')).toBe('refs/heads/main')
      expect(normalizeGitRef('')).toBe('')
    })
  })
})

describe('getTrimmedSha', () => {
  it('should trim SHA to 7 characters', () => {
    const fullSha = '1234567890abcdef1234567890abcdef12345678'
    expect(getTrimmedSha(fullSha)).toBe('1234567')
  })

  it('should handle short SHA', () => {
    const shortSha = '1234567'
    expect(getTrimmedSha(shortSha)).toBe('1234567')
  })
})

describe('GitCommitAction enum', () => {
  it('should have correct enum values', () => {
    expect(GitCommitAction.DELETE).toBe('DELETE')
    expect(GitCommitAction.CREATE).toBe('CREATE')
    expect(GitCommitAction.UPDATE).toBe('UPDATE')
    expect(GitCommitAction.MOVE).toBe('MOVE')
  })
})
