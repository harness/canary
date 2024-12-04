import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, ButtonGroup, Input, Text } from '@harnessio/canary'
import { CopyButton, FormFieldSet } from '@harnessio/views'

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
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="identifier">Name</FormFieldSet.Label>
            <Input
              id="identifier"
              value={defaultValues?.identifier}
              readOnly
              right={<CopyButton name={defaultValues?.identifier} />}
            />
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="lifetime">Expiration</FormFieldSet.Label>
            <Input id="lifetime" value={defaultValues?.lifetime} readOnly />
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {/* Expiration Info */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="token">Token</FormFieldSet.Label>
            <Input
              id="token"
              value={defaultValues?.token}
              readOnly
              right={<CopyButton name={defaultValues?.token} />}
              autoFocus
              className="overflow-hidden text-ellipsis whitespace-nowrap"
            />
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <Text>
              Your token has been generated. Please make sure to copy and store your token somewhere safe, you won’t be
              able to see it again.
            </Text>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {/* SUBMIT BUTTONS */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <ButtonGroup.Root className="justify-end">
              <Button type="button" variant="outline" size="default" onClick={onClose}>
                Got it
              </Button>
            </ButtonGroup.Root>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
