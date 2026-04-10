import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { SandboxLayout } from '@views'
import { isEmpty } from 'lodash-es'
import { z } from 'zod'

import {
  Alert,
  Button,
  ButtonLayout,
  ControlGroup,
  Fieldset,
  FormInput,
  FormWrapper,
  Layout,
  Message,
  MessageTheme,
  Radio,
  Text
} from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

export interface ConnectorRef {
  path: string
  identifier: string
}

const linkRepoSchema = z.object({
  connectorPath: z.string().min(1, { message: 'Please select a connector' }),
  connectorIdentifier: z.string().min(1, { message: 'Please select a connector' }),
  identifier: z
    .string()
    .min(1, { message: 'Please provide a name' })
    .regex(/^[a-z0-9-_.]+$/i, { message: 'Name can only contain letters, numbers, dash, dot, or underscore' }),
  description: z.string().optional(),
  isPublic: z.boolean()
})

export type RepoLinkFormFields = z.infer<typeof linkRepoSchema>

interface RepoLinkPageProps {
  onFormSubmit: (data: RepoLinkFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  connectorSelectorRenderer: (onSelect: (connector: ConnectorRef) => void) => React.ReactNode
  apiError?: string
}

export function RepoLinkView({
  onFormSubmit,
  onFormCancel,
  isLoading,
  connectorSelectorRenderer,
  apiError
}: RepoLinkPageProps) {
  const { t } = useTranslation()

  const formMethods = useForm<RepoLinkFormFields>({
    resolver: zodResolver(linkRepoSchema),
    mode: 'onChange',
    defaultValues: {
      connectorPath: '',
      connectorIdentifier: '',
      identifier: '',
      description: '',
      isPublic: true
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = formMethods

  const isPublicValue = watch('isPublic')

  const handleVisibilityChange = (value: string) => {
    setValue('isPublic', value === 'public', { shouldValidate: true })
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-[635px]">
        <Layout.Vertical gap="xl">
          <Layout.Vertical gap="md">
            <Text variant="heading-section">{t('views:repos.link.title', 'Link repository')}</Text>
            <Text className="max-w-[500px]">
              {t(
                'views:repos.link.description',
                'Link your GitHub repository to Harness Code using a connector. This syncs all Git data but places the repository in a Read-Only state within Harness; write access must be manually enabled.'
              )}
            </Text>
          </Layout.Vertical>

          <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)}>
            <Layout.Vertical gap="3xl">
              <Layout.Vertical gap="xl">
                {/* CONNECTOR */}
                <Fieldset>
                  {connectorSelectorRenderer((connector: ConnectorRef) => {
                    setValue('connectorPath', connector.path, { shouldValidate: true })
                    setValue('connectorIdentifier', connector.identifier, { shouldValidate: true })
                  })}
                  {errors.connectorPath && (
                    <Message theme={MessageTheme.ERROR}>{errors.connectorPath.message?.toString()}</Message>
                  )}
                </Fieldset>

                {/* NAME */}
                <Fieldset>
                  <FormInput.Text
                    id="identifier"
                    label={t('views:repos.createNewRepoForm.name.label', 'Name')}
                    {...register('identifier')}
                    placeholder={t('views:repos.createNewRepoForm.name.placeholder', 'Enter repository name')}
                    autoFocus
                    wrapperClassName="w-full"
                  />
                </Fieldset>

                {/* DESCRIPTION */}
                <Fieldset>
                  <FormInput.Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Linked from GitHub"
                    label={t('views:repos.createNewRepoForm.description.label', 'Description')}
                    optional
                    resizable
                    rows={4}
                    wrapperClassName="w-full"
                  />
                </Fieldset>
              </Layout.Vertical>

              <div>
                {/* VISIBILITY */}
                <Fieldset>
                  <ControlGroup>
                    <Radio.Root
                      value={isPublicValue ? 'public' : 'private'}
                      onValueChange={handleVisibilityChange}
                      label={t('views:repos.visibility', 'Visibility')}
                    >
                      <Radio.Item
                        id="visibility-public"
                        value="public"
                        label={t('views:repos.public', 'Public')}
                        caption={t(
                          'views:repos.fork.publicCaption',
                          'Anyone with access to Harness can clone this repo.'
                        )}
                      />
                      <Radio.Item
                        id="visibility-private"
                        value="private"
                        label={t('views:repos.private', 'Private')}
                        caption={t(
                          'views:repos.fork.privateCaption',
                          'You can choose who can see and commit to this repository.'
                        )}
                      />
                    </Radio.Root>
                  </ControlGroup>
                </Fieldset>

                {apiError && (
                  <Alert.Root theme="danger">
                    <Alert.Description>{apiError}</Alert.Description>
                  </Alert.Root>
                )}
              </div>

              {/* SUBMIT BUTTONS */}
              <Fieldset>
                <ControlGroup>
                  <ButtonLayout horizontalAlign="start">
                    <Button type="submit" disabled={isLoading || !isEmpty(errors)}>
                      {!isLoading
                        ? t('views:repos.link.linkRepository', 'Link repository')
                        : t('views:repos.link.linkingRepository', 'Linking repository...')}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onFormCancel}>
                      {t('views:repos.link.cancel', 'Cancel')}
                    </Button>
                  </ButtonLayout>
                </ControlGroup>
              </Fieldset>
            </Layout.Vertical>
          </FormWrapper>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

RepoLinkView.displayName = 'RepoLinkView'
