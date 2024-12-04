import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Button,
  ButtonGroup,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@harnessio/canary'

import { FormFieldSet } from '../index'

const importRepoFormSchema = z.object({
  identifier: z.string(),
  description: z.string(),
  pipelines: z.boolean().optional(),
  authorization: z.boolean().optional(),
  provider: z.string().min(1, { message: 'Please select a provider' }),
  password: z.string().optional(),
  organization: z.string().min(1, { message: 'Please select an organization' }),
  repository: z.string().min(1, { message: 'Please select a repository' })
})

export type RepoImportFormType = z.infer<typeof importRepoFormSchema>

export function RepoImportForm({
  isLoading = false,
  onCancel,
  onSubmit,
  error
}: {
  isLoading?: boolean
  onCancel: () => void
  onSubmit: (data: RepoImportFormType) => void
  error?: string
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<RepoImportFormType>({
    resolver: zodResolver(importRepoFormSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      description: '',
      pipelines: false,
      authorization: false,
      provider: 'Github',
      password: '',
      organization: '',
      repository: ''
    }
  })

  const providerValue = watch('provider')

  const providerOptions = [
    `Github`,
    `Gitlab`,
    `Bitbucket`,
    `Azure DevOps`,
    `Github Enterprise`,
    `Gitlab Self-Hosted`,
    `Bitbucket Server`,
    `Gitea`,
    `Gogs`
  ]

  const repositoryValue = watch('repository')

  useEffect(() => {
    setValue('identifier', repositoryValue)
  }, [repositoryValue, setValue])

  const handleSelectChange = (fieldName: keyof RepoImportFormType, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleFormSubmit: SubmitHandler<RepoImportFormType> = data => {
    onSubmit(data)
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="provider">Provider</FormFieldSet.Label>
            <Select value={providerValue} onValueChange={value => handleSelectChange('provider', value)}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {providerOptions.map(providerOption => {
                  return (
                    <SelectItem key={providerOption} value={providerOption} disabled={providerOption !== 'Github'}>
                      {providerOption}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {errors.provider && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.provider.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {/* Org */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="organization" required>
              Organization
            </FormFieldSet.Label>
            <Input id="organization" {...register('organization')} placeholder="Enter the organization name" />
            {errors.organization && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.organization.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="repository" required>
              Repository
            </FormFieldSet.Label>
            <Input id="repository" {...register('repository')} placeholder="Enter the repository name" />
            {errors.repository && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.repository.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup className="flex flex-row gap-5">
            <FormFieldSet.Option
              control={
                <Checkbox
                  {...register('authorization')}
                  id="authorization"
                  checked={watch('authorization')}
                  onCheckedChange={(checked: boolean) => setValue('authorization', checked)}
                />
              }
              id="authorization"
              label="Requires Authorization"
              className="mt-0 flex min-h-8 items-center"
            />

            <FormFieldSet.Option
              control={
                <Checkbox
                  {...register('pipelines')}
                  id="pipelines"
                  checked={watch('pipelines')}
                  onCheckedChange={(checked: boolean) => setValue('pipelines', checked)}
                />
              }
              // id={`${event.id}`}
              id="pipelines"
              label="Import Pipelines"
              className="mt-0 flex min-h-8 items-center"
            />
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {watch('authorization') && (
          <FormFieldSet.Root>
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="password">Token</FormFieldSet.Label>
              <Input id="password" type="password" {...register('password')} placeholder="Enter your access token" />
              {errors.password && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                  {errors.password.message?.toString()}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        )}

        <FormFieldSet.Separator />

        <FormFieldSet.Root className="mt-8">
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="identifier" required>
              Name
            </FormFieldSet.Label>
            <Input id="identifier" {...register('identifier')} placeholder="Enter the repository name" />
            {errors.identifier && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.identifier.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="description">Description</FormFieldSet.Label>
            <Input id="description" {...register('description')} placeholder="Enter a description" />
            {errors.description && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.description.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>

        {error && (
          <FormFieldSet.Root>
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>{error}</FormFieldSet.Message>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        )}

        {/* SUBMIT BUTTONS */}
        <FormFieldSet.Root>
          <FormFieldSet.ControlGroup>
            <ButtonGroup.Root className="justify-end">
              <>
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {!isLoading ? 'Import Repository' : 'Importing...'}
                </Button>
              </>
            </ButtonGroup.Root>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
