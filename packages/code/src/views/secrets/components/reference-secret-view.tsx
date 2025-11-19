import { Button, Caption, IconV2, TextInput } from '@harnessio/ui/components'

interface ReferenceSecretViewProps {
  onTest: (value: string) => void
  value: string
  setValue: (value: string) => void
}

export const ReferenceSecretView: React.FC<ReferenceSecretViewProps> = ({ onTest, value, setValue }) => {
  return (
    <div className="flex flex-col gap-cn-3xs">
      <div className="flex w-full items-center gap-cn-xs">
        <div className="grow">
          <TextInput
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter reference secret value"
          />
        </div>
        <Button onClick={() => onTest(value)} variant="primary">
          <IconV2 name="clipboard-check" />
          Test
        </Button>
      </div>
      <Caption className="text-cn-3">
        Enter the path to an existing secret in your Vault instance. Click Test to verify the secret exists.
      </Caption>
    </div>
  )
}
