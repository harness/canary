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
  labels: ILabelType[]
  presetEditLabel: ILabelType | null
  page: number
  totalPages: number

  values: Record<string, LabelValueType[]>

  repo_ref: string | null
  space_ref: string | null
  getParentScopeLabels: boolean

  setLabels: (labels: ILabelType[]) => void
  addLabel: (label: ILabelType) => void
  deleteLabel: (key: string) => void
  setPresetEditLabel: (label: ILabelType | null) => void
  setPage: (page: number) => void

  setValues: (values: Record<string, LabelValueType[]>) => void
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
