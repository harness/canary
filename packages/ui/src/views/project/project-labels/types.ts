import { TranslationStore } from '@/views'
import { z } from 'zod'

import { createLabelFormSchema } from './components/create-label-dialog'

export enum ColorsEnum {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  PINK = 'pink',
  VIOLET = 'violet',
  INDIGO = 'indigo',
  CYAN = 'cyan',
  ORANGE = 'orange',
  BROWN = 'brown',
  MINT = 'mint',
  LIME = 'lime'
}

export type CreateLabelFormFields = z.infer<typeof createLabelFormSchema>

export interface CreateLabelDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateLabelFormFields, identifier?: string) => void
  useTranslationStore: () => TranslationStore
  isCreatingLabel: boolean
  error: string
  useLabelsStore: () => ILabelsStore
}
export interface ILabelType {
  color: ColorsEnum
  created?: number
  created_by?: number
  description?: string
  id?: number
  key: string
  repo_id?: number | null
  scope?: number
  space_id?: number | null
  type?: 'dynamic' | 'static'
  updated?: number
  updated_by?: number
  value_count?: number
}

export interface LabelValueType {
  color?: ColorsEnum
  created?: number
  created_by?: number
  id?: number
  label_id?: number
  updated?: number
  updated_by?: number
  value?: string
}

export interface ILabelsStore {
  spaceLabels: ILabelType[]
  repoLabels: ILabelType[]
  presetEditLabel: ILabelType | null
  page: number
  totalPages: number
  spaceValues: Record<string, LabelValueType[]>
  repo_ref: string | null
  space_ref: string | null
  repoValues: Record<string, LabelValueType[]>
  getParentScopeLabels: boolean

  setSpaceLabels: (labels: ILabelType[]) => void
  setRepoLabels: (labels: ILabelType[]) => void
  addSpaceLabel: (label: ILabelType) => void
  addRepoLabel: (label: ILabelType) => void
  deleteSpaceLabel: (key: string) => void
  deleteRepoLabel: (key: string) => void
  setPresetEditLabel: (label: ILabelType | null) => void
  setPage: (page: number) => void
  setSpaceValues: (values: Record<string, LabelValueType[]>) => void
  setRepoValues: (values: Record<string, LabelValueType[]>) => void
  setRepoSpaceRef: (repo_ref?: string, space_ref?: string) => void
  setGetParentScopeLabels: (getParentScopeLabels: boolean) => void
}

export interface ProjectLabelPageProps {
  useTranslationStore: () => TranslationStore
  useLabelsStore: () => ILabelsStore
  createdIn?: string
  handleEditLabel: (identifier: string) => void
  openCreateLabelDialog: () => void
  handleDeleteLabel: (identifier: string) => void
  showSpacer?: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  isLoadingSpaceLabels: boolean
}

export interface LabelsListViewProps {
  useTranslationStore: () => TranslationStore
  createdIn?: string
  labels: ILabelType[]
  handleEditLabel: (identifier: string) => void
  handleDeleteLabel: (identifier: string) => void
  isDirtyList: boolean
  handleResetSearch: () => void
  searchQuery: string | null
  openCreateLabelDialog: () => void
  values: Record<string, LabelValueType[]>
  useLabelsStore: () => ILabelsStore
}
