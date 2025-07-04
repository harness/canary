import { InputOrientationProp, LabelProps } from '@/components'

export interface BaseInputsProp
  extends InputOrientationProp,
    Pick<LabelProps, 'optional' | 'informerProps' | 'informerContent'> {
  wrapperClassName?: string
  caption?: string
  error?: string
  warning?: string
  labelSuffix?: LabelProps['suffix']
}
