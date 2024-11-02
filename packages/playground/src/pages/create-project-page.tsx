import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Icon, Text, Spacer } from '@harnessio/canary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SandboxLayout } from '..'

interface PageProps {
  isLoading?: boolean
  onFormSubmit: (data: InputProps) => void
  apiError?: string | null
}
interface InputProps {
  identifier: string
  description?: string
  is_public?: boolean
  parent_ref?: string
}

const createProjectSchema = z.object({
  identifier: z.string().min(4, {
    message: 'Enter a valid project name with at least 4 characters'
  })
})

export function CreateProjectPage({ isLoading, onFormSubmit, apiError }: PageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<InputProps>({
    resolver: zodResolver(createProjectSchema)
  })

  const onSubmit = (data: InputProps) => {
    onFormSubmit(data)
  }

  return (
    <SandboxLayout.Main hasHeader hasLeftPanel className="flex items-center">
      <SandboxLayout.Content maxWidth="md">
        <Card variant="plain" width="full">
          <CardHeader>
            <CardTitle className="flex flex-col place-items-center">
              <Icon name="create-workspace" size={112} />
              <Spacer size={4} />
              <Text size={6} weight="medium" color="primary">
                Create your new project
              </Text>
              <Spacer size={2} />
              <Text size={2} color="tertiaryBackground">
                Orginaze your projects, pipelines and more.
              </Text>
            </CardTitle>
          </CardHeader>
          <Spacer size={1} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label htmlFor="identifier" variant="sm">
                Project name
              </Label>
              <Spacer size={1} />
              <Input
                id="identifier"
                type="text"
                {...register('identifier', { required: true })}
                placeholder="Enter your project name"
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
                {isLoading ? 'Creating project...' : 'Create project'}
              </Button>
            </form>
            <Spacer size={4} />
          </CardContent>
        </Card>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
