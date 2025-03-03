import { useForm } from 'react-hook-form'

import { Option, RadioButton, RadioGroup, StackedList } from '@/components'
import { cn } from '@utils/cn'

export enum SecretType {
  New = 'new',
  Existing = 'existing'
}

interface SecretTypeForm {
  type: SecretType
}

export const SecretsHeader = ({
  onChange,
  selectedType: selectedTypeVal
}: {
  onChange: (type: SecretType) => void
  selectedType: SecretType
}) => {
  const { watch, setValue } = useForm<SecretTypeForm>({
    defaultValues: {
      type: selectedTypeVal
    }
  })

  const selectedType = watch('type')

  const handleTypeChange = (value: SecretType) => {
    setValue('type', value)
    onChange(value)
  }

  return (
    <RadioGroup value={selectedTypeVal} onValueChange={handleTypeChange} id="secret-type">
      <div className="flex flex-col gap-2">
        <Option
          id="new-secret"
          control={
            <StackedList.Root className="overflow-hidden" borderBackground>
              <StackedList.Item
                className={cn('cursor-pointer !rounded px-5 py-3', {
                  '!bg-background-4': selectedType === SecretType.New
                })}
                isHeader
                isLast
                actions={<RadioButton value={SecretType.New} />}
                onClick={() => handleTypeChange(SecretType.New)}
              >
                <StackedList.Field title="New Secret" description="Create a new secret." />
              </StackedList.Item>
            </StackedList.Root>
          }
        />
        <Option
          id="existing-secret"
          control={
            <StackedList.Root className="overflow-hidden" borderBackground>
              <StackedList.Item
                className={cn('cursor-pointer !rounded px-5 py-3', {
                  '!bg-background-4': selectedType === SecretType.Existing
                })}
                isHeader
                isLast
                actions={<RadioButton value={SecretType.Existing} />}
                onClick={() => handleTypeChange(SecretType.Existing)}
              >
                <StackedList.Field title="Existing Secret" description="Use an existing secret." />
              </StackedList.Item>
            </StackedList.Root>
          }
        />
      </div>
    </RadioGroup>
  )
}
