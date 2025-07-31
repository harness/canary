import { SummaryItemType, type RepoFile } from '@harnessio/ui/views'

import { getLogsText, sortFilesByType, sortPathsByType } from '../common-utils'

// Mock data for testing
const mockLogs = [{ out: 'Log line 1\n' }, { out: 'Log line 2\n' }, { out: 'Log line 3\n' }]

const mockFiles: RepoFile[] = [
  {
    name: 'file1.txt',
    type: SummaryItemType.File,
    id: '1',
    path: 'file1.txt',
    lastCommitMessage: 'file1 commit',
    timestamp: '2021-09-01T00:00:00Z'
  },
  {
    name: 'folder1',
    type: SummaryItemType.Folder,
    id: '2',
    path: 'folder1',
    lastCommitMessage: 'folder1 commit',
    timestamp: '2021-09-01T00:00:00Z'
  },
  {
    name: 'file2.txt',
    type: SummaryItemType.File,
    id: '3',
    path: 'file2.txt',
    lastCommitMessage: 'file2 commit',
    timestamp: '2021-09-01T00:00:00Z'
  },
  {
    name: 'folder2',
    type: SummaryItemType.Folder,
    id: '4',
    path: 'folder2',
    lastCommitMessage: 'folder2 commit',
    timestamp: '2021-09-01T00:00:00Z'
  }
]

describe('getLogsText', () => {
  it('should concatenate log lines into a single string', () => {
    const result = getLogsText(mockLogs)
    expect(result).toBe('Log line 1\nLog line 2\nLog line 3\n')
  })

  it('should return an empty string if logs array is empty', () => {
    const result = getLogsText([])
    expect(result).toBe('')
  })
})

describe('sortFilesByType', () => {
  it('should sort files by type, with folders first', () => {
    const result = sortFilesByType(mockFiles)
    expect(result).toEqual([
      {
        name: 'folder1',
        type: SummaryItemType.Folder,
        id: '2',
        path: 'folder1',
        lastCommitMessage: 'folder1 commit',
        timestamp: '2021-09-01T00:00:00Z'
      },
      {
        name: 'folder2',
        type: SummaryItemType.Folder,
        id: '4',
        path: 'folder2',
        lastCommitMessage: 'folder2 commit',
        timestamp: '2021-09-01T00:00:00Z'
      },
      {
        name: 'file1.txt',
        type: SummaryItemType.File,
        id: '1',
        path: 'file1.txt',
        lastCommitMessage: 'file1 commit',
        timestamp: '2021-09-01T00:00:00Z'
      },
      {
        name: 'file2.txt',
        type: SummaryItemType.File,
        id: '3',
        path: 'file2.txt',
        lastCommitMessage: 'file2 commit',
        timestamp: '2021-09-01T00:00:00Z'
      }
    ])
  })

  it('should handle an empty array', () => {
    const result = sortFilesByType([])
    expect(result).toEqual([])
  })

  it('should handle an array with only files', () => {
    const filesOnly = [
      {
        name: 'file1.txt',
        type: SummaryItemType.File,
        id: '1',
        path: 'file1.txt',
        lastCommitMessage: 'file1 commit',
        timestamp: '2021-09-01T00:00:00Z'
      },
      {
        name: 'file2.txt',
        type: SummaryItemType.File,
        id: '2',
        path: 'file2.txt',
        lastCommitMessage: 'file2 commit',
        timestamp: '2021-10-01T00:00:00Z'
      }
    ]
    const result = sortFilesByType(filesOnly)
    expect(result).toEqual(filesOnly)
  })

  it('should handle an array with only folders', () => {
    const foldersOnly = [
      {
        name: 'folder1',
        type: SummaryItemType.Folder,
        id: '2',
        path: 'folder1',
        lastCommitMessage: 'folder1 commit',
        timestamp: '2021-09-01T00:00:00Z'
      },
      {
        name: 'folder2',
        type: SummaryItemType.Folder,
        id: '2',
        path: 'folder2',
        lastCommitMessage: 'folder2 commit',
        timestamp: '2021-10-01T00:00:00Z'
      }
    ]
    const result = sortFilesByType(foldersOnly)
    expect(result).toEqual(foldersOnly)
  })
})

describe('sortPathsByType', () => {
  it('should sort paths by type, with directories coming before files', () => {
    const paths = ['file1.txt', 'folder1', 'file2.txt', 'folder2']
    const pathToTypeMap = new Map<string, string>([
      ['file1.txt', 'file'],
      ['folder1', 'dir'],
      ['file2.txt', 'file'],
      ['folder2', 'dir']
    ])

    const result = sortPathsByType(paths, pathToTypeMap)

    expect(result).toEqual(['folder1', 'folder2', 'file1.txt', 'file2.txt'])
    // Make sure the original array was not modified
    expect(paths).toEqual(['file1.txt', 'folder1', 'file2.txt', 'folder2'])
  })

  it('should handle an empty array', () => {
    const result = sortPathsByType([], new Map())
    expect(result).toEqual([])
  })

  it('should handle an array with only files', () => {
    const paths = ['file1.txt', 'file2.txt']
    const pathToTypeMap = new Map<string, string>([
      ['file1.txt', 'file'],
      ['file2.txt', 'file']
    ])

    const result = sortPathsByType(paths, pathToTypeMap)
    expect(result).toEqual(['file1.txt', 'file2.txt'])
  })

  it('should handle an array with only directories', () => {
    const paths = ['folder1', 'folder2']
    const pathToTypeMap = new Map<string, string>([
      ['folder1', 'dir'],
      ['folder2', 'dir']
    ])

    const result = sortPathsByType(paths, pathToTypeMap)
    expect(result).toEqual(['folder1', 'folder2'])
  })

  it('should handle paths that are not in the map', () => {
    const paths = ['file1.txt', 'folder1', 'unknown']
    const pathToTypeMap = new Map<string, string>([
      ['file1.txt', 'file'],
      ['folder1', 'dir']
    ])

    const result = sortPathsByType(paths, pathToTypeMap)
    // 'unknown' should remain in its original position as it's not identified as either folder or file
    expect(result).toEqual(['folder1', 'file1.txt', 'unknown'])
  })
})
