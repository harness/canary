import React, { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Icon,
  StackedList,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Textarea,
  Checkbox
} from '@harnessio/canary'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldSet } from '../index'
import { MessageTheme } from '../components/form-field-set'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  targetPatterns: z.string().min(1, 'Description is required'),
  includePatterns: z.enum(['', '1', '2', '3']),
  toggleValue: z.boolean(),
  bypassValue: z.string().optional(),
  access: z.enum(['1', '2'], {}),
  defaultBranchValue: z.boolean().optional(),
  editPermissionsValue: z.boolean().optional(),
  rules: z.array(
    z.object({
      id: z.string(),
      checked: z.boolean()
    })
  )
})
export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema

interface RepoSettingsGeneralFormProps {
  /* onFormSubmit?: (data: FormFields) => void
  onFormCancel?: () => void
  apiError?: string | null
  isLoading?: boolean
  isSuccess?: boolean*/
  isLoading?: boolean
}
const rules = [
  {
    id: 'request-approval',
    label: 'Request approval of new changes',
    description: 'Require re-approval when there are new changes in the pull request'
  },
  {
    id: 'change-requests',
    label: 'Require resolution of change requests',
    description: 'All change requests on a pull request must be resolved before it can be merged'
  },
  {
    id: 'comment-resolution',
    label: 'Require comment resolution',
    description: 'All comments on a pull request must be resolved before it can be merged'
  },
  {
    id: 'status-checks',
    label: 'Require status checks to pass',
    description: 'Selected status checks must pass before a pull request can be merged'
  },
  {
    id: 'merge-strategies',
    label: 'Limit merge strategies',
    description: 'Limit which merge strategies are available to merge a pull request'
  },
  {
    id: 'auto-delete',
    label: 'Auto delete branch on merge',
    description: 'Automatically delete the source branch of a pull request after it is merged'
  }
]

export const RepoSettingsRulesPage: React.FC<{ isLoading: boolean }> = ({ isLoading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      targetPatterns: '',
      toggleValue: true,
      defaultBranchValue: true,
      editPermissionsValue: false,
      bypassValue: '',
      access: '1',
      rules: rules.map(rule => ({ id: rule.id, checked: false }))
    }
  })

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }
  const includePatterns = watch('includePatterns')
  const toggleValue = watch('toggleValue')
  const bypassValue = watch('bypassValue')
  const defaultBranchValue = watch('defaultBranchValue')
  const editPermissionsValue = watch('editPermissionsValue')
  const rulesValue = watch('rules')

  const onSubmit: SubmitHandler<FormFields> = data => {
    setIsSubmitted(true)
    console.log(data)
    reset()
    setTimeout(() => {
      setIsSubmitted(false)
    }, 2000)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFieldSet.Root>
          <StackedList.Root className="border-none mb-8">
            <StackedList.Item disableHover isHeader>
              <StackedList.Field
                title="Enable the rule"
                description="Eget vestibulum eu lacinia ultrices id et morbi."
              />
              <StackedList.Field
                label
                secondary
                title={
                  <div
                    className="flex gap-1.5 items-center justify-end cursor-pointer"
                    onClick={() => setValue('toggleValue', !watch('toggleValue'))}>
                    {' '}
                    <Icon name={toggleValue ? 'toggle-active' : 'toggle-inactive'} size={toggleValue ? 30 : 50} />
                  </div>
                }
                right
              />
            </StackedList.Item>
          </StackedList.Root>
          {/* NAME */}
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="name" required>
              Name
            </FormFieldSet.Label>
            <Input id="name" {...register('name')} placeholder="Enter rule name" autoFocus />
            {errors.name && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.name.message?.toString()}</FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
          {/* DESCRIPTION */}
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="description" required>
              Description
            </FormFieldSet.Label>
            <Textarea id="description" {...register('description')} placeholder="Enter a description of this rule..." />
            {errors.description && (
              <FormFieldSet.Message theme={MessageTheme.ERROR}>
                {errors.description.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>

          {/* PATTERNS */}
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="target-patterns" required>
              Target Patterns
            </FormFieldSet.Label>
            <div className="flex gap-4">
              <div className="flex-[2.5]">
                <Input
                  id="target-patterns"
                  {...register('targetPatterns')}
                  placeholder="Enter the target patterns"
                  autoFocus
                />
                <Text size={2} as="p" color="tertiaryBackground" className="max-w-[100%]">
                  Match branches using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)
                </Text>{' '}
              </div>
              <div className="flex-[1]">
                <Select value={includePatterns} onValueChange={value => handleSelectChange('includePatterns', value)}>
                  <SelectTrigger id="includePatterns">
                    <SelectValue placeholder="Include" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">option 1</SelectItem>
                    <SelectItem value="2">option 2</SelectItem>
                    <SelectItem value="3">option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.includePatterns && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.includePatterns.message?.toString()}
                </FormFieldSet.Message>
              )}

              {errors.targetPatterns && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.targetPatterns.message?.toString()}
                </FormFieldSet.Message>
              )}
            </div>
          </FormFieldSet.ControlGroup>
          <FormFieldSet.ControlGroup className="flex flex-row">
            <Checkbox
              {...register('defaultBranchValue')}
              checked={defaultBranchValue}
              onCheckedChange={() => setValue('defaultBranchValue', !watch('defaultBranchValue'))}
              id="default-branch"
            />
            <label htmlFor="default-branch">Default Branch</label>

            {errors.defaultBranchValue && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.defaultBranchValue.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
          <FormFieldSet.ControlGroup>
            <FormFieldSet.Label htmlFor="bypassValue">Bypass list</FormFieldSet.Label>
            <Select value={bypassValue} onValueChange={value => handleSelectChange('bypassValue', value)}>
              <SelectTrigger id="bypassValue">
                <SelectValue placeholder="Select users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">option 1</SelectItem>
                <SelectItem value="2">option 2</SelectItem>
                <SelectItem value="3">option 3</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldSet.ControlGroup>
          <FormFieldSet.ControlGroup className="flex flex-row">
            <Checkbox
              {...register('editPermissionsValue')}
              checked={editPermissionsValue}
              onCheckedChange={() => setValue('editPermissionsValue', !watch('editPermissionsValue'))}
              id="edit-permissons"
            />
            <FormFieldSet.Label htmlFor="edit-permissons">
              Allow users with edit permission on the repository to bypass
            </FormFieldSet.Label>
            {errors.editPermissionsValue && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                {errors.editPermissionsValue.message?.toString()}
              </FormFieldSet.Message>
            )}
          </FormFieldSet.ControlGroup>
          <FormFieldSet.ControlGroup className="max-w-sm">
            <FormFieldSet.Label>Rules: select all that apply</FormFieldSet.Label>
            {rules.map((rule, index) => (
              <FormFieldSet.Option
                key={rule.id}
                className="mt-0"
                control={
                  <Checkbox
                    id={rule.id}
                    checked={rulesValue[index]?.checked}
                    onCheckedChange={checked => {
                      const updatedRules = rulesValue.map((r, i) =>
                        r.id === rule.id ? { ...r, checked: checked === true } : r
                      )
                      setValue('rules', updatedRules)
                    }}
                  />
                }
                id={rule.id}
                label={rule.label}
                description={rule.description}
              />
            ))}
          </FormFieldSet.ControlGroup>
          <FormFieldSet.Root>
            <FormFieldSet.ControlGroup>
              <ButtonGroup.Root>
                {!isSubmitted ? (
                  <>
                    <Button type="submit" size="sm" disabled={!isValid || isLoading}>
                      {!isLoading ? 'Create rule' : 'Creating rule...'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => {}}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" type="button" size="sm" theme="success" className="pointer-events-none">
                    Rule created&nbsp;&nbsp;
                    <Icon name="tick" size={14} />
                  </Button>
                )}
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
