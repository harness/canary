import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, CopyButton, Fieldset, Input, Text } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// import { FormFieldSet } from '@harnessio/views'

const formSchema = z.object({
  identifier: z.string(),
  lifetime: z.string(),
  token: z.string()
})

export type TokenSuccessFormType = z.infer<typeof formSchema>

interface TokenCreateFormProps {
  defaultValues: TokenSuccessFormType
  onClose: () => void
}

export function TokenSuccessForm({ defaultValues, onClose }: TokenCreateFormProps) {
  const { setValue } = useForm<TokenSuccessFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  })

  useEffect(() => {
    if (defaultValues) {
      setValue('identifier', defaultValues.identifier)
      setValue('lifetime', defaultValues.lifetime)
      setValue('token', defaultValues.token)
    }
  }, [defaultValues, setValue])

  return (
    <>
      <form>
        {/* NAME */}
        <Fieldset>
          <ControlGroup>
            <Input
              id="identifier"
              value={defaultValues?.identifier}
              readOnly
              label="Name"
              // right={<CopyButton name={defaultValues?.identifier} />}
            />
          </ControlGroup>
        </Fieldset>

        <Fieldset>
          <ControlGroup>
            <Input id="lifetime" value={defaultValues?.lifetime} label="Expiration" readOnly />
          </ControlGroup>
        </Fieldset>

        {/* Expiration Info */}
        <Fieldset>
          <ControlGroup>
            <Input
              id="token"
              value={defaultValues?.token}
              readOnly
              // right={<CopyButton name={defaultValues?.token} />}
              autoFocus
              className="truncate"
              label="Token"
            />
          </ControlGroup>
        </Fieldset>

        <Fieldset>
          <ControlGroup>
            <Text>
              Your token has been generated. Please make sure to copy and store your token somewhere safe, you won’t be
              able to see it again.
            </Text>
          </ControlGroup>
        </Fieldset>

        {/* SUBMIT BUTTONS */}
        <Fieldset>
          <ControlGroup>
            <ButtonGroup className="justify-end">
              <Button type="button" variant="outline" size="default" onClick={onClose}>
                Got it
              </Button>
            </ButtonGroup>
          </ControlGroup>
        </Fieldset>
      </form>
    </>
  )
}
