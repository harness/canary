import { DiffFileEntry, TypesCommit, TypesDiffStats } from '@/views'

export interface ICommitDetailsStore {
  diffs: DiffFileEntry[]
  commitData: TypesCommit | null
  diffStats: TypesDiffStats | null
  isVerified?: boolean
  setDiffs: (diffs: DiffFileEntry[]) => void
  setCommitData: (commitData: TypesCommit) => void
  setDiffStats: (diffStats: TypesDiffStats) => void
  setIsVerified: (isVerified: boolean) => void
}
