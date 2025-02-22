import { FC } from 'react'

import { Button, Icon, Input, InputProps, Select, SelectRootProps } from '@/components'
import { cn, ColorsEnum, TranslationStore } from '@/views'

const SelectColorMarker = {
  [ColorsEnum.RED]: 'bg-label-foreground-red',
  [ColorsEnum.BLUE]: 'bg-label-foreground-blue',
  [ColorsEnum.GREEN]: 'bg-label-foreground-green',
  [ColorsEnum.YELLOW]: 'bg-label-foreground-yellow',
  [ColorsEnum.PURPLE]: 'bg-label-foreground-purple',
  [ColorsEnum.PINK]: 'bg-label-foreground-pink',
  [ColorsEnum.VIOLET]: 'bg-label-foreground-violet',
  [ColorsEnum.INDIGO]: 'bg-label-foreground-indigo',
  [ColorsEnum.CYAN]: 'bg-label-foreground-cyan',
  [ColorsEnum.ORANGE]: 'bg-label-foreground-orange',
  [ColorsEnum.BROWN]: 'bg-label-foreground-brown',
  [ColorsEnum.MINT]: 'bg-label-foreground-mint',
  [ColorsEnum.LIME]: 'bg-label-foreground-lime'
}

interface LabelFormColorAndNameGroupProps {
  className?: string
  isValue?: boolean
  useTranslationStore: () => TranslationStore
  handleDeleteValue?: () => void
  selectProps?: SelectRootProps
  inputProps?: InputProps
}

export const LabelFormColorAndNameGroup: FC<LabelFormColorAndNameGroupProps> = ({
  className,
  isValue = false,
  useTranslationStore,
  handleDeleteValue,
  selectProps,
  inputProps
}) => {
  const { t } = useTranslationStore()

  const isWithDeleteButton = isValue && !!handleDeleteValue

  return (
    <div
      className={cn(
        'grid grid-cols-[8rem_1fr] gap-x-2.5',
        isWithDeleteButton && 'grid-cols-[8rem_1fr_auto]',
        className
      )}
    >
      <Select.Root {...selectProps}>
        <Select.Content>
          {Object.values(ColorsEnum).map(color => (
            <Select.Item key={color} value={color}>
              <div className="flex max-w-full items-center gap-x-1.5">
                <div className={`size-2 min-h-2 min-w-2 rounded-full ${SelectColorMarker[color]}`} />
                <span className="truncate text-foreground-3">{color}</span>
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Input
        placeholder={
          isValue
            ? t('views:labelData.form.colorValuePlaceholder', 'Enter value name')
            : t('views:labelData.form.colorLabelPlaceholder', 'Enter label name')
        }
        size="md"
        {...inputProps}
      />

      {isWithDeleteButton && (
        <Button
          className="size-4 flex-none self-center text-icons-1 hover:text-icons-2"
          variant="custom"
          size="icon"
          onClick={handleDeleteValue}
        >
          <Icon name="close" size={14} />
        </Button>
      )}
    </div>
  )
}
