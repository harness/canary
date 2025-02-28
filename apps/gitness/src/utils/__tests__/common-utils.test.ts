import { SummaryItemType, type RepoFile } from '@harnessio/ui/views'

import { getLogsText, sortFilesByType } from '../common-utils'

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
