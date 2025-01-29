import { useForm, type SubmitHandler } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormSeparator,
  FormWrapper,
  Input,
  Option,
  Select,
  SelectContent,
  SelectItem,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ProviderOptionsEnum } from './types'

const formSchema = z
  .object({
    hostUrl: z.string().optional(),
    pipelines: z.boolean().optional(),
    repositories: z.boolean().optional(),
    provider: z.string().min(1, { message: 'Please select a provider' }),
    password: z.string().optional(),
    organization: z.string().min(1, { message: 'Please enter an organization' })
  })
  .superRefine((data, ctx) => {
    if (data.provider === 'Github Enterprise' && !data.hostUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['hostUrl'],
        message: 'Repository URL is required'
      })
    }
  })

export type ImportMultipleReposFormFields = z.infer<typeof formSchema>

interface RepoImportMultiplePageProps {
  onFormSubmit: (data: ImportMultipleReposFormFields) => void
  onFormCancel: () => void
  isLoading: boolean
  apiErrorsValue?: string
}

export function RepoImportMultiplePage({
  onFormSubmit,
  onFormCancel,
  isLoading,
  apiErrorsValue
}: RepoImportMultiplePageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ImportMultipleReposFormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      pipelines: false,
      repositories: true,
      provider: 'Github',
      password: '',
      organization: ''
    }
  })

  const providerValue = watch('provider')

  const handleSelectChange = (fieldName: keyof ImportMultipleReposFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<ImportMultipleReposFormFields> = data => {
    onFormSubmit(data)
  }

  const handleCancel = () => {
    onFormCancel()
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content paddingClassName="w-[570px] mx-auto pt-11 pb-20">
        <Spacer size={5} />
        <Text className="tracking-tight" size={5} weight="medium">
          Import Repositories
        </Text>
        <Spacer size={10} />
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          {/* provider */}
          <Fieldset>
            <ControlGroup>
              <Select
                name="provider"
                value={providerValue}
                onValueChange={value => handleSelectChange('provider', value)}
                placeholder="Select"
                label="Git provider"
              >
                <SelectContent>
                  {ProviderOptionsEnum &&
                    Object.values(ProviderOptionsEnum)?.map(option => {
                      return (
                        <SelectItem
                          key={option}
                          value={option}
                          disabled={
                            option !== ProviderOptionsEnum.GITHUB && option !== ProviderOptionsEnum.GITHUB_ENTERPRISE
                          }
                        >
                          {option}
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </ControlGroup>
          </Fieldset>
          {watch('provider') === ProviderOptionsEnum.GITHUB_ENTERPRISE && (
            <Fieldset>
              <Input
                id="host"
                label="Host URL"
                {...register('hostUrl')}
                placeholder="Enter the host URL"
                size="md"
                error={errors.hostUrl?.message?.toString()}
              />
            </Fieldset>
          )}

          {/* token */}
          <Fieldset>
            <ControlGroup>
              <Input
                type="password"
                id="password"
                label="Token"
                {...register('password')}
                placeholder="Enter your access token"
                size="md"
                error={errors.password?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          <FormSeparator />

          {/* organization */}
          <Fieldset>
            <Input
              id="organization"
              label="Organization"
              {...register('organization')}
              placeholder="Enter the organization name"
              size="md"
              error={errors.organization?.message?.toString()}
            />
          </Fieldset>

          {/* authorization - pipelines */}
          <Fieldset>
            <ControlGroup className="flex flex-row gap-5">
              <Option
                control={<Checkbox {...register('repositories')} id="authorization" checked={true} disabled />}
                id="authorization"
                label="Repositories"
                className="mt-0 flex min-h-8 items-center"
              />
              <Option
                control={
                  <Checkbox
                    {...register('pipelines')}
                    id="pipelines"
                    checked={watch('pipelines')}
                    onCheckedChange={(checked: boolean) => setValue('pipelines', checked)}
                  />
                }
                id="pipelines"
                label="Import Pipelines"
                className="mt-0 flex min-h-8 items-center"
              />
            </ControlGroup>
          </Fieldset>

          {!!apiErrorsValue && <span className="text-xs text-destructive">{apiErrorsValue}</span>}
          {/* SUBMIT BUTTONS */}
          <Fieldset>
            <ControlGroup>
              <ButtonGroup>
                {/* TODO: Improve loading state to avoid flickering */}
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? 'Import repositories' : 'Importing repositories...'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </ButtonGroup>
            </ControlGroup>
          </Fieldset>
        </FormWrapper>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
