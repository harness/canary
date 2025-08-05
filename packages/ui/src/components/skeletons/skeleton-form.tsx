import { FC } from 'react'

import { ControlGroup, Fieldset, InputOrientationProp } from '@components/form-primitives'
import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

import { SkeletonTypography } from './skeleton-typography'

const skeletonFormVariants = cva('cn-skeleton-form-item', {
  variants: {
    size: {
      sm: 'cn-skeleton-form-item-sm',
      md: 'cn-skeleton-form-item-md'
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

export interface SkeletonFormItemProps extends InputOrientationProp {
  withLabel?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  size?: VariantProps<typeof skeletonFormVariants>['size']
}

export const SkeletonFormItem: FC<SkeletonFormItemProps> = ({
  orientation,
  withLabel,
  labelClassName,
  inputClassName,
  size
}) => {
  return (
    <ControlGroup.Root orientation={orientation}>
      {withLabel && (
        <ControlGroup.LabelWrapper className={labelClassName}>
          <SkeletonTypography className="w-[71px]" />
        </ControlGroup.LabelWrapper>
      )}

      <ControlGroup.InputWrapper className={cn(skeletonFormVariants({ size }), inputClassName)}>
        <SkeletonTypography className="w-[162px]" />
      </ControlGroup.InputWrapper>
    </ControlGroup.Root>
  )
}

SkeletonFormItem.displayName = 'SkeletonFormItem'

export interface SkeletonFormProps {
  className?: string
  linesCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  itemProps?: SkeletonFormItemProps
}

export const SkeletonForm: FC<SkeletonFormProps> = ({
  className,
  linesCount = 9,
  itemProps: {
    withLabel = true,
    labelClassName: itemLabelClassName,
    inputClassName: itemInputClassName,
    size = 'md',
    orientation = 'vertical'
  } = {}
}) => {
  return (
    <Fieldset className={cn('cn-skeleton-form-field', className)}>
      {Array.from({ length: linesCount }).map((_, index) => (
        <SkeletonFormItem
          key={index}
          withLabel={withLabel}
          labelClassName={itemLabelClassName}
          inputClassName={itemInputClassName}
          size={size as VariantProps<typeof skeletonFormVariants>['size']}
          orientation={orientation as InputOrientationProp['orientation']}
        />
      ))}
    </Fieldset>
  )
}
