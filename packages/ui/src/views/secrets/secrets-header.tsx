import { Checkbox, StackedList } from '@/components'
import { cn } from '@utils/cn'

export enum SecretType {
  New = 'new',
  Existing = 'existing'
}

export const SecretsHeader = ({
  selectedType,
  setSelectedType
}: {
  selectedType: SecretType
  setSelectedType: (type: SecretType) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <StackedList.Root className="overflow-hidden" borderBackground>
        <StackedList.Item
          className={cn('cursor-pointer !rounded px-5 py-3', {
            '!bg-background-4': selectedType === SecretType.New
          })}
          isHeader
          isLast
          onClick={() => setSelectedType(SecretType.New)}
          actions={
            <Checkbox
              checked={selectedType === SecretType.New}
              onCheckedChange={() => setSelectedType(SecretType.New)}
            />
          }
        >
          <StackedList.Field title="New Secret" description="Create a new secret." />
        </StackedList.Item>
      </StackedList.Root>
      <StackedList.Root className="overflow-hidden" borderBackground>
        <StackedList.Item
          className={cn('cursor-pointer !rounded px-5 py-3', {
            '!bg-background-4': selectedType === SecretType.Existing
          })}
          isHeader
          isLast
          onClick={() => setSelectedType(SecretType.Existing)}
          actions={
            <Checkbox
              checked={selectedType === SecretType.Existing}
              onCheckedChange={() => setSelectedType(SecretType.Existing)}
            />
          }
        >
          <StackedList.Field title="Existing Secret" description="Use an existing secret." />
        </StackedList.Item>
      </StackedList.Root>
    </div>
  )
}
