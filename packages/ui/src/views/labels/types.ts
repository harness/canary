import { EnumLabelColor } from '@views/repo/pull-request'
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
  isDynamic: z.boolean().optional(),
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
  space_id?: number | null
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

export interface TypesLabelValueInfo {
  color?: string | null
  id?: number | null
  value?: string | null
}

export type EnumLabelType = 'dynamic' | 'static'

export interface TypesLabelAssignment {
  assigned?: boolean | null
  assigned_value?: TypesLabelValueInfo
  color?: EnumLabelColor
  id?: number
  key?: string
  scope?: number
  type?: EnumLabelType
  values?: TypesLabelValueInfo[]
}

export type TypesRepositoryCore = {
  default_branch?: string
  id?: number
  identifier?: string
  parent_id?: number
  path?: string
} | null

export interface TypesSpaceCore {
  id?: number
  identifier?: string
  parent_id?: number
  path?: string
}

export interface TypesScopeData {
  repository?: TypesRepositoryCore
  scope?: number
  space?: TypesSpaceCore
}

export interface TypesScopesLabels {
  label_data?: TypesLabelAssignment[] | null
  scope_data?: TypesScopeData[] | null
}

export interface SetRepoSpaceRefProps {
  repo_ref?: string
  space_ref?: string
}

export interface ILabelsStore {
  labels: ILabelType[]

  page: number
  totalItems: number
  pageSize: number

  values: LabelValuesType
  isLoading: boolean

  repo_ref: string | null
  space_ref: string | null
  getParentScopeLabels: boolean

  setIsLoading: (isLoading: boolean) => void
  setLabels: (labels: ILabelType[], paginationData: { totalItems: number; pageSize: number }) => void
  addLabel: (label: ILabelType) => void
  deleteLabel: (key: string) => void
  setPage: (page: number) => void

  setValues: (values: LabelValuesType) => void
  setRepoSpaceRef: (values: SetRepoSpaceRefProps) => void
  setGetParentScopeLabels: (getParentScopeLabels: boolean) => void

  resetLabelsAndValues: () => void
}

export interface TypesBranchTable {
  created?: number
  created_by?: number
  name?: string
  updated?: number
  updated_by?: number
}
