import { TranslationStore } from '@/views'
import { z } from 'zod'

export enum LabelType {
  DYNAMIC = 'dynamic',
  STATIC = 'static'
}

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

export const createLabelFormSchema = z.object({
  id: z.number().optional(),
  key: z
    .string()
    .min(1, { message: 'Label name is required' })
    .max(50, { message: 'Label name must be 50 characters or less' }),
  color: z.nativeEnum(ColorsEnum),
  description: z.string().optional(),
  type: z.nativeEnum(LabelType),
  values: z.array(
    z.object({
      id: z.number().optional(),
      color: z.nativeEnum(ColorsEnum),
      value: z
        .string()
        .min(1, { message: 'Value is required' })
        .max(50, { message: 'Value must be 50 characters or less' })
    })
  )
})

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
  id: number
  key: string
  repo_id?: number | null
  scope: number
  space_id: number | null
  type: LabelType
  updated: number
  updated_by: number
  value_count: number
}

export interface LabelValueType {
  color: ColorsEnum
  created: number
  created_by: number
  id: number
  label_id: number
  updated: number
  updated_by: number
  value: string
}

export type LabelValuesType = Record<string, LabelValueType[]>

export interface SetRepoSpaceRefProps {
  repo_ref?: string
  space_ref?: string
}

export interface ILabelsStore {
  labels: ILabelType[]
  page: number
  totalPages: number

  values: LabelValuesType

  repo_ref: string | null
  space_ref: string | null
  getParentScopeLabels: boolean

  setLabels: (labels: ILabelType[]) => void
  addLabel: (label: ILabelType) => void
  deleteLabel: (key: string) => void
  setPage: (page: number) => void

  setValues: (values: LabelValuesType) => void
  setRepoSpaceRef: (values: SetRepoSpaceRefProps) => void
  setGetParentScopeLabels: (getParentScopeLabels: boolean) => void

  resetLabelsAndValues: () => void
}
