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
  Checkbox,
  Switch,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem
} from '@harnessio/canary'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldSet } from '../index'
import { MessageTheme } from '../components/form-field-set'
import { rules } from '../components/repo-settings/repo-branch-settings-rules/repo-branch-settings-rules-data'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  targetPatterns: z.string().min(1, 'Patterns are required'),
  toggleValue: z.boolean(),
  bypassValue: z.string().optional(),
  access: z.enum(['1', '2']),
  defaultBranchValue: z.boolean().optional(),
  editPermissionsValue: z.boolean().optional(),
  rules: z.array(
    z.object({
      id: z.string(),
      checked: z.boolean(),
      submenu: z.array(z.string()),
      selectOptions: z.string()
    })
  )
})
export type FormFields = z.infer<typeof formSchema>

// interface RepoSettingsRulesPageProps {
//   onFormSubmit?: (data: FormFields) => void
//   onFormCancel?: () => void
//   apiError?: string | null
//   isLoading?: boolean
//   isSuccess?: boolean
// }

export const RepoBranchSettingsRulesPage: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
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
      rules: rules.map(rule => ({ id: rule.id, checked: false, submenu: [], selectOptions: '' }))
    }
  })

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState('Include')

  const handleCheckboxChange = (ruleId: string, checked: boolean) => {
    const updatedRules = rulesValue.map(r => (r.id === ruleId ? { ...r, checked } : r))
    setValue('rules', updatedRules)
  }
  const handleSubmenuChange = (ruleId: string, submenuId: string, checked: boolean) => {
    const updatedRules = rulesValue.map(rule => {
      if (rule.id === ruleId) {
        const updatedSubmenu = checked
          ? [...(rule.submenu || []), submenuId]
          : (rule.submenu || []).filter(id => id !== submenuId)
        return { ...rule, submenu: updatedSubmenu }
      }
      return rule
    })
    setValue('rules', updatedRules)
  }

  const handleSelectChangeForRule = (ruleId: string, selectedOptions: string) => {
    const updatedRules = rulesValue.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, selectOptions: selectedOptions }
      }
      return rule
    })
    setValue('rules', updatedRules)
  }
  const handleSelectChange = (fieldName: keyof FormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }
  const toggleValue = watch('toggleValue')
  const bypassValue = watch('bypassValue')
  const defaultBranchValue = watch('defaultBranchValue')
  const editPermissionsValue = watch('editPermissionsValue')
  const rulesValue = watch('rules')

  console.log(rulesValue)

  const onSubmit: SubmitHandler<FormFields> = data => {
    setIsSubmitted(true)
    console.log(data)
    reset()
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
                  <div className="flex gap-1.5 items-center justify-end cursor-pointer">
                    {' '}
                    <Switch
                      {...register('toggleValue')}
                      checked={toggleValue}
                      onCheckedChange={() => setValue('toggleValue', !watch('toggleValue'))}
                    />
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
              <Button
                onClick={() => {}}
                variant="split"
                type="button"
                className="pl-0 pr-0"
                dropdown={
                  <DropdownMenu>
                    <DropdownMenuTrigger insideSplitButton>
                      <Icon name="chevron-down" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="mt-1">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setSelectedOption('Include')}>Include</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSelectedOption('Exclude')}>Exclude</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }>
                {selectedOption}
              </Button>

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
              <div key={rule.id}>
                <FormFieldSet.Option
                  className="mt-0"
                  control={
                    <Checkbox
                      id={rule.id}
                      checked={rulesValue[index]?.checked}
                      onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
                    />
                  }
                  id={rule.id}
                  label={rule.label}
                  description={rule.description}
                />

                {/* Conditionally render the submenu if this rule has a submenu and is checked */}
                {rule.hasSubmenu && rulesValue[index].checked && (
                  <div className="pl-6 mt-2">
                    {rule.submenuOptions.map(subOption => (
                      <FormFieldSet.Option
                        key={subOption.id}
                        control={
                          <Checkbox
                            id={subOption.id}
                            checked={rulesValue[index].submenu?.includes(subOption.id)}
                            onCheckedChange={checked => handleSubmenuChange(rule.id, subOption.id, checked === true)}
                          />
                        }
                        id={subOption.id}
                        label={subOption.label}
                      />
                    ))}
                  </div>
                )}

                {rule.hasSelect && rulesValue[index].checked && (
                  <div className="pl-6 mt-2">
                    <Select
                      value={rulesValue[index].selectOptions}
                      onValueChange={value => handleSelectChangeForRule(rule.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status checks" />
                      </SelectTrigger>
                      <SelectContent>
                        {rule.selectOptions.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
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
