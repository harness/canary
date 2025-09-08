import { ComponentProps, FC } from 'react'

import { Button, FormInput, FormSelectProps, IconV2, Layout, SelectValueOption, Text } from '@/components'
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
      <Layout.Horizontal gap="2xs" className="max-w-full" align="center">
        <div className={`cn-dropdown-menu-item-indicator cn-dropdown-menu-item-indicator-${color}`} />
        <Text as="span" truncate color="foreground-1">
          {color}
        </Text>
      </Layout.Horizontal>
    ),
    value: color
  }))

  return (
    <Layout.Grid
      gapX="xs"
      className={cn('grid-cols-[128px_1fr]', isWithDeleteButton && 'grid-cols-[128px_1fr_auto]', className)}
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
          className="mt-[2px]"
          variant="ghost"
          iconOnly
          onClick={handleDeleteValue}
          size="sm"
          aria-label={t('views:labelData.form.removeValue', 'Remove a value')}
        >
          <IconV2 name="xmark" />
        </Button>
      )}
    </Layout.Grid>
  )
}
