import { ComponentProps, FC } from 'react'

import { Button, FormInput, FormSelectProps, IconV2, SelectValueOption } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { ColorsEnum } from '@/views'

interface LabelFormColorAndNameGroupProps {
  className?: string
  isValue?: boolean
  handleDeleteValue?: () => void
  selectProps: Omit<FormSelectProps<ColorsEnum>, 'options'>
  inputProps: ComponentProps<typeof FormInput.Text>
}

export const LabelFormColorAndNameGroup: FC<LabelFormColorAndNameGroupProps> = ({
  className,
  isValue = false,
  handleDeleteValue,
  selectProps,
  inputProps
}) => {
  const { t } = useTranslation()

  const isWithDeleteButton = isValue && !!handleDeleteValue

  const options: SelectValueOption<ColorsEnum>[] = Object.values(ColorsEnum).map(color => ({
    label: (
      <div className="flex max-w-full items-center gap-x-1.5">
        <div className={`bg-label-foreground-${color} size-2 min-h-2 min-w-2 rounded-full`} />
        <span className="truncate text-cn-foreground-1">{color}</span>
      </div>
    ),
    value: color
  }))

  return (
    <div
      className={cn(
        'grid grid-cols-[8rem_1fr] gap-x-2.5',
        isWithDeleteButton && 'grid-cols-[8rem_1fr_auto]',
        className
      )}
    >
      <FormInput.Select options={options} {...selectProps} />

      <FormInput.Text
        placeholder={
          isValue
            ? t('views:labelData.form.colorValuePlaceholder', 'Enter value name')
            : t('views:labelData.form.colorLabelPlaceholder', 'Enter label name')
        }
        {...inputProps}
      />

      {isWithDeleteButton && (
        <Button
          className="size-4 flex-none self-center text-icons-1 hover:text-icons-2"
          variant="ghost"
          iconOnly
          onClick={handleDeleteValue}
        >
          <IconV2 name="xmark" size="2xs" />
        </Button>
      )}
    </div>
  )
}
