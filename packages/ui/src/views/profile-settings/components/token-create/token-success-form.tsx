import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Fieldset, FormWrapper, Input, Text } from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

const formSchema = z.object({
  identifier: z.string(),
  lifetime: z.string(),
  token: z.string()
})

export type TokenSuccessFormType = z.infer<typeof formSchema>

interface TokenCreateFormProps {
  defaultValues: TokenSuccessFormType | null
  onClose: () => void
  useTranslationStore: () => TranslationStore
}

export function TokenSuccessForm({ defaultValues, onClose, useTranslationStore }: TokenCreateFormProps) {
  const { t } = useTranslationStore()
  const { setValue } = useForm<TokenSuccessFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      identifier: '',
      lifetime: '',
      token: ''
    }
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
      <FormWrapper>
        {/* NAME */}
        <Fieldset>
          <ControlGroup>
            <Input
              id="identifier"
              value={defaultValues?.identifier}
              readOnly
              label={t('views:profileSettings.name', 'Name')}
              // @todo Add a copy button to copy the identifier value when base component is ready
              // right={<CopyButton name={defaultValues?.identifier} />}
            />
          </ControlGroup>
        </Fieldset>

        <Fieldset>
          <ControlGroup>
            <Input
              id="lifetime"
              value={defaultValues?.lifetime}
              label={t('views:profileSettings.expiration', 'Expiration')}
              readOnly
            />
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
              label={t('views:profileSettings.token', 'Token')}
            />
          </ControlGroup>
        </Fieldset>

        <Fieldset>
          <ControlGroup>
            <Text>
              {t(
                'views:profileSettings.tokenSuccessDescription',
                'Your token has been generated. Please make sure to copy and store your token somewhere safe, you won’t beable to see it again.'
              )}
            </Text>
          </ControlGroup>
        </Fieldset>

        {/* SUBMIT BUTTONS */}
        <Fieldset>
          <ControlGroup>
            <ButtonGroup className="justify-end">
              <Button type="button" variant="outline" size="default" onClick={onClose}>
                {t('views:profileSettings.gotItButton', 'Got it')}
              </Button>
            </ButtonGroup>
          </ControlGroup>
        </Fieldset>
      </FormWrapper>
    </>
  )
}
