import { useEffect } from 'react'
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
import { z } from 'zod'
import { useListBranchesQuery } from '@harnessio/code-service-client'
import { CreateFormType } from '../../../types'
import { useGetRepoRef } from '../../../framework/hooks/useGetRepoPath'

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
  const form = useZodForm({
    schema: createPipelineSchema,
    defaultValues: {
      name: '',
      branch: 'main',
      yamlPath: ''
    }
  })

  const repoRef = useGetRepoRef()

  const { data, isLoading } = useListBranchesQuery({ repo_ref: repoRef, queryParams: {} })

  const { watch, setValue, clearErrors, trigger } = form

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
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Branch*</FormLabel>
            <Select disabled={isLoading || !data?.length} onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="text-primary">
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.map(branchItem => (
                  <SelectItem value={branchItem?.name as string}>{branchItem?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel} className="text-primary" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Create Pipeline</Button>
      </div>
    </Form>
  )
}
