export interface CreatePipelineFormType {
  name: string
  branch: string
  yamlPath: string
}

export interface CreatePipelineDialogProps {
  branchNames?: string[]
  isLoadingBranchNames: boolean
  defaultBranch: string
  isLoadingDefaultBranch: boolean
  isOpen: boolean
  onClose: () => void
  onCancel: () => void
  onSubmit: (formValues: CreatePipelineFormType) => Promise<void>
}
