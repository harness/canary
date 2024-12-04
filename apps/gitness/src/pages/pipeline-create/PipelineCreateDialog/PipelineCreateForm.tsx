import { useEffect } from 'react'

import { z } from 'zod'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useZodForm
} from '@harnessio/canary'
import { useFindRepositoryQuery, useListBranchesQuery } from '@harnessio/code-service-client'

import { useGetRepoRef } from '../../../framework/hooks/useGetRepoPath'
import { CreateFormType } from '../../../types'

interface PipelineCreateFormProps {
  onCancel: () => void
  onSubmit: (formValues: CreateFormType) => Promise<void>
}

const createPipelineSchema = z.object({
  name: z.string().min(1, { message: 'Pipeline name is required' }),
  branch: z.string().min(1, { message: 'Branch name is required' }),
  yamlPath: z.string().min(1, { message: 'YAML path is required' })
})

export function PipelineCreateForm({ onCancel, onSubmit }: PipelineCreateFormProps) {
  const repoRef = useGetRepoRef()

  const { data: { body: branches } = {}, isLoading } = useListBranchesQuery({ repo_ref: repoRef, queryParams: {} })
  const { data: { body: repositoryData } = {}, isLoading: loadingRepoData } = useFindRepositoryQuery({
    repo_ref: repoRef
  })

  const form = useZodForm({
    schema: createPipelineSchema,
    defaultValues: {
      name: '',
      branch: repositoryData?.default_branch || 'main',
      yamlPath: ''
    }
  })

  const { watch, setValue, clearErrors, trigger } = form

  const branch = watch('branch')

  useEffect(() => {
    if (repositoryData?.default_branch) {
      setValue('branch', repositoryData?.default_branch)
    }
  }, [repositoryData?.default_branch, setValue])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'name') {
        setValue('yamlPath', value.name ? `.harness/${value.name}.yaml` : '')

        /**
         * This is to validate YAML path field
         */
        trigger('yamlPath')
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, clearErrors])

  return (
    <Form className="space-y-6" form={form} onSubmit={onSubmit}>
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Pipeline name*</FormLabel>
              <FormControl>
                <Input className="text-primary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="yamlPath"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">YAML path*</FormLabel>
            <FormControl>
              <Input className="text-primary" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch"
        key={branch}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Branch*</FormLabel>
            <Select disabled={isLoading || loadingRepoData} onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="text-primary">
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {branches?.map(branch => (
                  <SelectItem key={branch?.name} value={branch?.name as string}>
                    {branch?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onCancel} className="text-primary" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Create Pipeline</Button>
      </div>
    </Form>
  )
}
