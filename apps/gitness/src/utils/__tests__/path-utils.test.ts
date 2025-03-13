import { decodeURIComponentIfValid, splitPathWithParents } from '../path-utils'

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
