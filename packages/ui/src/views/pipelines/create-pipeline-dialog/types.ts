export interface ICreatePipelineStore {
  branchNames?: string[]
  isLoadingBranchNames?: boolean
  defaultBranch?: string
  setBranchesState: (payload: { isLoadingBranchNames: boolean; branchNames?: string[]; defaultBranch?: string }) => void
  error?: { message: string }
  setError: (error?: { message: string }) => void
}

export interface CreatePipelineFormType {
  name: string
  branch: string
  yamlPath: string
}

export interface CreatePipelineDialogProps {
  useCreatePipelineStore: () => ICreatePipelineStore
  isOpen: boolean
  onClose: () => void
  onCancel: () => void
  onSubmit: (formValues: CreatePipelineFormType) => Promise<void>
}
