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
  onSubmit: (data: CreateLabelFormFields) => void
  useTranslationStore: () => any
  isCreatingLabel: boolean
  error: string
}
