export interface ICreatePipelineStore {
  branchNames?: string[]
  isLoadingBranchNames?: boolean
  defaultBranch?: string
  setBranchesState: (payload: { isLoadingBranchNames: boolean; branchNames?: string[]; defaultBranch?: string }) => void
  error?: { message: string }
  setError: (error?: { message: string }) => void
}
