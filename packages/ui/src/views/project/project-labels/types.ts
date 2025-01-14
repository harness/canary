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
  useTranslationStore: () => any
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

export interface ILabelsStore {
  labels: ILabelType[]
  presetEditLabel: ILabelType | null
  setLabels: (labels: ILabelType[]) => void
  addLabel: (label: ILabelType) => void
  deleteLabel: (key: string) => void
  setPresetEditLabel: (label: ILabelType | null) => void
}

export interface ProjectLabelPageProps {
  openAlertDeleteDialog: (params: { identifier: string; type: string }) => void
  useTranslationStore: () => TranslationStore
  useLabelsStore: () => ILabelsStore
  space_ref?: string
  handleEditLabel: (identifier: string) => void
  openCreateLabelDialog: () => void
  handleDeleteLabel: (identifier: string) => void
}

export interface LabelsListViewProps {
  useTranslationStore: () => TranslationStore
  space_ref?: string
  labels: ILabelType[]
  handleEditLabel: (identifier: string) => void
  handleDeleteLabel: (identifier: string) => void
}
