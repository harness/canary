import { useForm } from 'react-hook-form'

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
import { SandboxLayout } from '@views'
import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'lodash-es'
import { z } from 'zod'

export enum ForkType {
  Branch = 'branch',
  Full = 'full'
}

const forkFormSchema = z.object({
  forkType: z.nativeEnum(ForkType, { message: 'Please select a fork type' }),
  branchToFork: z.string().optional(),
  forkDestination: z.string().min(1, { message: 'Please select a fork destination' }),
  name: z
    .string()
    .min(1, { message: 'Please provide a name' })
    .regex(/^[a-z0-9-_.]+$/i, { message: 'Name can only contain letters, numbers, dash, dot, or underscore' }),
  // description: z.string(),
  makePrivate: z.boolean()
})

export type RepoForkFormFields = z.infer<typeof forkFormSchema>

interface RepoForkPageProps {
  onFormSubmit: (data: RepoForkFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  branchSelectorRenderer?: (onBranchSelect: (branchName: string) => void, currentBranchName: string) => React.ReactNode
  destinationSelectorRenderer: (onDestinationSelect: (destination: string) => void) => React.ReactNode
  apiError?: string
  repoIdentifier?: string
  isPublic?: boolean
  defaultBranchName?: string
}

export function RepoForkView({
  onFormSubmit,
  onFormCancel,
  isLoading,
  branchSelectorRenderer,
  destinationSelectorRenderer,
  apiError,
  repoIdentifier = '',
  isPublic = false,
  defaultBranchName = ''
}: RepoForkPageProps) {
  const { t } = useTranslation()

  const formMethods = useForm<RepoForkFormFields>({
    resolver: zodResolver(forkFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: repoIdentifier,
      // description: '',
      forkType: ForkType.Branch,
      branchToFork: defaultBranchName || '',
      forkDestination: '',
      makePrivate: !isPublic
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = formMethods

  // const _descriptionValue = watch('description')
  const forkTypeValue = watch('forkType')
  const branchToForkValue = watch('branchToFork')
  const makePrivateValue = watch('makePrivate')

  const handleMakePrivateChange = (value: boolean) => {
    setValue('makePrivate', !isPublic ? true : value, { shouldValidate: true })
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="mx-auto w-[635px]">
        <Layout.Vertical gap="xl">
          <Layout.Vertical gap="md">
            <Text variant="heading-section">
              {t('views:repos.createNewFork', 'Create a new fork of {{repoName}}', { repoName: repoIdentifier })}
            </Text>
            <Text className="max-w-[500px]">
              {t(
                'views:repos.forkDescription',
                'Fork a repository to create a new repository with the same files and history.'
              )}
            </Text>
          </Layout.Vertical>

          <FormWrapper {...formMethods} onSubmit={handleSubmit(onFormSubmit)}>
            <Layout.Vertical gap="3xl">
              <Layout.Vertical gap="xl">
                {/* FORK TYPE */}
                <Fieldset>
                  <FormInput.Radio id="forkType" {...register('forkType')} wrapperClassName="w-full">
                    <Radio.Item
                      id="forkType-branch"
                      value={ForkType.Branch}
                      label={t('views:repos.fork.branchFork', 'Branch')}
                      caption={t('views:repos.fork.branchForkCaption', 'Fork a single branch')}
                    />
                    <Radio.Item
                      id="forkType-full"
                      value={ForkType.Full}
                      label={t('views:repos.fork.fullFork', 'Full repo fork')}
                      caption={t('views:repos.fork.fullForkCaption', 'Fork the entire repository')}
                    />
                  </FormInput.Radio>
                </Fieldset>

                {/* BRANCH TO FORK */}
                {forkTypeValue === ForkType.Branch && (
                  <Fieldset className="!gap-y-cn-sm">
                    <Text variant="body-strong">{t('views:repos.fork.branch', 'Branch')}</Text>
                    {branchSelectorRenderer?.((branchName: string) => {
                      setValue('branchToFork', branchName, { shouldValidate: true })
                    }, branchToForkValue || defaultBranchName)}
                  </Fieldset>
                )}

                {/* FORK DESTINATION */}
                <Fieldset>
                  {destinationSelectorRenderer((destination: string) => {
                    setValue('forkDestination', destination, { shouldValidate: true })
                  })}
                </Fieldset>

                {/* NAME */}
                <Fieldset>
                  <FormInput.Text
                    id="name"
                    label={t('views:repos.createNewRepoForm.name.label', 'Name')}
                    {...register('name')}
                    placeholder={t('views:repos.createNewRepoForm.name.placeholder', 'Enter repository name')}
                    autoFocus
                    wrapperClassName="w-full"
                  />
                  {/* DESCRIPTION */}
                  {/* <FormInput.Textarea
                    id="description"
                    {...register('description')}
                    placeholder={t(
                      'views:repos.createNewRepoForm.description.placeholder',
                      'Enter a description of this repository'
                    )}
                    label={t('views:repos.createNewRepoForm.description.label', 'Description')}
                    optional
                    resizable
                    rows={6}
                    wrapperClassName="w-full"
                  /> */}
                </Fieldset>
              </Layout.Vertical>

              <div>
                {/* VISIBILITY */}
                <Fieldset>
                  <ControlGroup>
                    <Radio.Root
                      value={makePrivateValue ? 'private' : 'public'}
                      onValueChange={value => handleMakePrivateChange(value === 'private')}
                      disabled={!isPublic}
                      label={t('views:repos.visibility', 'Visibility')}
                    >
                      <Radio.Item
                        id="visibility-public"
                        value="public"
                        disabled={!isPublic}
                        label={t('views:repos.public', 'Public')}
                        caption={t(
                          'views:repos.fork.publicCaption',
                          'Anyone with access to Harness can clone this repo.'
                        )}
                      />
                      <Radio.Item
                        id="visibility-private"
                        value="private"
                        disabled={!isPublic}
                        label={t('views:repos.private', 'Private')}
                        caption={t(
                          'views:repos.fork.privateCaption',
                          'You can choose who can see and commit to this repository.'
                        )}
                      />
                    </Radio.Root>
                    {errors.makePrivate && (
                      <Message theme={MessageTheme.ERROR}>{errors.makePrivate.message?.toString()}</Message>
                    )}
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
                        ? t('views:repos.fork.forkRepository', 'Fork repository')
                        : t('views:repos.fork.forkingRepository', 'Forking repository...')}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onFormCancel}>
                      {t('views:repos.cancel', 'Cancel')}
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

RepoForkView.displayName = 'RepoForkView'
