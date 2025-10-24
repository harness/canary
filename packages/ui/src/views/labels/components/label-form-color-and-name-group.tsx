import { FC } from 'react'
import { UseFormRegister } from 'react-hook-form'

import { Button, Icon, Input, Select } from '@/components'
import { ColorsEnum, CreateLabelFormFields, TranslationStore } from '@/views'

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
  name: string
  colorValue: ColorsEnum
  handleColorChange: (color: ColorsEnum) => void
  colorError?: string
  nameError?: string
  isValue?: boolean
  useTranslationStore: () => TranslationStore
  register: UseFormRegister<CreateLabelFormFields>
  registerName: keyof CreateLabelFormFields
  handleDeleteValue?: () => void
}

export const LabelFormColorAndNameGroup: FC<LabelFormColorAndNameGroupProps> = ({
  name,
  colorValue,
  handleColorChange,
  colorError,
  nameError,
  isValue = false,
  useTranslationStore,
  register,
  registerName,
  handleDeleteValue
}) => {
  const { t } = useTranslationStore()

  return (
    <div className="flex gap-x-2.5">
      <div className="w-32 flex-none">
        <Select.Root name={`color-${name}`} value={colorValue} onValueChange={handleColorChange} error={colorError}>
          <Select.Content>
            {Object.values(ColorsEnum).map(color => (
              <Select.Item key={color} value={color}>
                <div className="flex max-w-full items-center gap-x-1.5">
                  <div className={`size-2 rounded-full ${SelectColorMarker[color]}`} />
                  <span className="truncate">{color}</span>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      <Input
        wrapperClassName="flex-1"
        {...register(registerName)}
        placeholder={
          isValue
            ? t('views:labelData.form.colorValuePlaceholder', 'Enter value name')
            : t('views:labelData.form.colorLabelPlaceholder', 'Enter label name')
        }
        error={nameError}
        size="md"
      />
      {isValue && !!handleDeleteValue && (
        <Button
          className="mx-[-9px] h-9 flex-none text-icons-1 hover:text-icons-2"
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
