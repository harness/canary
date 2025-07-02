import { InputOrientationProp, LabelProps } from '@/components'

export interface BaseInputsProp extends InputOrientationProp, Omit<LabelProps, 'suffix' | 'disabled'> {
  wrapperClassName?: string
  caption?: string
  error?: string
  warning?: string
  labelSuffix?: LabelProps['suffix']
}
