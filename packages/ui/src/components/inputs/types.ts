import { InputOrientationProp, LabelProps } from '@/components'

export interface CommonInputsProp
  extends InputOrientationProp,
    Pick<LabelProps, 'optional' | 'informerProps' | 'informerContent'> {
  label?: string
  wrapperClassName?: string
  caption?: string
  error?: string
  warning?: string
  labelSuffix?: LabelProps['suffix']
}
