import React, { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Icon,
  StackedList,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Textarea
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
  gitignore: z.enum(['', '1', '2', '3']),

  access: z.enum(['1', '2'], {})
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

export const RepoSettingsRulesPage = () => {
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
      access: '1'
    }
  })

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }
  const gitignoreValue = watch('gitignore')

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
      <StackedList.Root className="border-none mb-8">
        <StackedList.Item disableHover isHeader>
          <StackedList.Field title="Enable the rule" description="Eget vestibulum eu lacinia ultrices id et morbi." />
          <StackedList.Field
            label
            secondary
            title={
              <div className="flex gap-1.5 items-center justify-end">
                <Icon name="toggle-active" size={30} className="text-tertiary-background" />
              </div>
            }
            right
          />
        </StackedList.Item>
      </StackedList.Root>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <FormFieldSet.Root>
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
              <Input
                id="target-patterns"
                {...register('targetPatterns')}
                placeholder="Enter the target patterns"
                autoFocus
                className="flex-[2.5]"
              />
              <div className="flex-[1]">
                <Select value={gitignoreValue} onValueChange={value => handleSelectChange('gitignore', value)}>
                  <SelectTrigger id="gitignore">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">.gitignore option 1</SelectItem>
                    <SelectItem value="2">.gitignore option 2</SelectItem>
                    <SelectItem value="3">.gitignore option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.gitignore && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.gitignore.message?.toString()}
                </FormFieldSet.Message>
              )}

              {errors.targetPatterns && (
                <FormFieldSet.Message theme={MessageTheme.ERROR}>
                  {errors.targetPatterns.message?.toString()}
                </FormFieldSet.Message>
              )}
            </div>
          </FormFieldSet.ControlGroup>
        </FormFieldSet.Root>
      </form>
    </>
  )
}
