import { useForm } from 'react-hook-form'

import { Button, Card, CardContent, CardHeader, CardTitle, Icon, Input, Label, Spacer, Text } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface PageProps {
  isLoading?: boolean
  onFormSubmit: (data: CreateProjectFormFields) => void
  apiError?: string | null
  useTranslationStore: () => TranslationStore
}
// interface InputProps {
//   identifier: string
//   description?: string
//   is_public?: boolean
//   parent_ref?: string
// }

const createProjectSchema = z.object({
  identifier: z.string().min(4, {
    message: 'Enter a valid project name with at least 4 characters'
  })
})

export type CreateProjectFormFields = z.infer<typeof createProjectSchema>

export function CreateProjectPage({ isLoading, onFormSubmit, apiError, useTranslationStore }: PageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateProjectFormFields>({
    resolver: zodResolver(createProjectSchema)
  })

  const onSubmit = (data: CreateProjectFormFields) => {
    onFormSubmit(data)
  }

  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Main className="flex items-center justify-center">
      <SandboxLayout.Content>
        <Card variant="plain" width="full">
          <CardHeader>
            <CardTitle className="flex flex-col place-items-center">
              <Icon name="create-workspace" size={112} />
              <Spacer size={4} />
              <Text size={6} weight="medium" color="primary">
                {t('views:createProject.newProject', 'Create your new project')}
              </Text>
              <Spacer size={2} />
              <Text size={2} color="tertiaryBackground">
                {t('views:createProject.description', 'Organize your repositories, pipelines and more.')}{' '}
              </Text>
            </CardTitle>
          </CardHeader>
          <Spacer size={1} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label htmlFor="identifier">{t('views:createProject.projectName', 'Project name')}</Label>
              <Spacer size={1} />
              <Input
                id="identifier"
                type="text"
                {...register('identifier', { required: true })}
                placeholder={t('views:createProject.projectNamePlaceholder', 'Enter your project name')}
                autoFocus
              />
              {errors.identifier && (
                <>
                  <Spacer size={2} />
                  <Text size={1} className="text-destructive">
                    {errors.identifier.message?.toString()}
                  </Text>
                </>
              )}
              {apiError && (
                <>
                  <Spacer size={2} />
                  <Text size={1} className="text-destructive">
                    {apiError?.toString()}
                  </Text>
                </>
              )}
              <Spacer size={8} />
              <Button variant="default" borderRadius="full" type="submit" loading={isLoading} className="w-full">
                {isLoading
                  ? t('views:createProject.creating', 'Creating project...')
                  : t('views:createProject.create', 'Create project')}
              </Button>
            </form>
            <Spacer size={4} />
          </CardContent>
        </Card>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
