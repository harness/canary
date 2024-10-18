import React, { useState } from 'react'
import {
  Input,
  Textarea,
  Text,
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  Button,
  Icon,
  Checkbox,
  StackedList,
  Switch
} from '@harnessio/canary'
import { FormFieldSet, MessageTheme } from '../../../index'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { RepoBranchSettingsFormFields } from './repo-branch-settings-rules-schema'
import { rules } from './repo-branch-settings-rules-data'

interface FieldProps {
  register: UseFormRegister<RepoBranchSettingsFormFields>
  errors: FieldErrors<RepoBranchSettingsFormFields>
  watch: UseFormWatch<RepoBranchSettingsFormFields>
  setValue: UseFormSetValue<RepoBranchSettingsFormFields>
}

export const BranchSettingsRuleToggleField: React.FC<FieldProps> = ({ register, watch, setValue, errors: _ }) => (
  <StackedList.Root className="border-none mb-8">
    <StackedList.Item disableHover isHeader>
      <StackedList.Field title="Enable the rule" description="Eget vestibulum eu lacinia ultrices id et morbi." />
      <StackedList.Field
        label
        secondary
        title={
          <div className="flex gap-1.5 items-center justify-end cursor-pointer">
            {' '}
            <Switch
              {...register('toggleValue')}
              checked={watch('toggleValue')}
              onCheckedChange={() => setValue('toggleValue', !watch('toggleValue'))}
            />
          </div>
        }
        right
      />
    </StackedList.Item>
  </StackedList.Root>
)

export const BranchSettingsRuleNameField: React.FC<FieldProps> = ({ register, watch: _, setValue: __, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="name" required>
      Name
    </FormFieldSet.Label>
    <Input id="name" {...register('name')} placeholder="Enter rule name" autoFocus />
    {errors.name && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.name.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const BranchSettingsRuleDescriptionField: React.FC<FieldProps> = ({
  register,
  watch: __,
  setValue: _,
  errors
}) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="description" required>
      Description
    </FormFieldSet.Label>
    <Textarea id="description" {...register('description')} placeholder="Enter a description of this rule..." />
    {errors.description && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors.description.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const BranchSettingsRuleTargetPatternsField: React.FC<FieldProps> = ({
  register,
  watch: __,
  setValue: _,
  errors
}) => {
  const [selectedOption, setSelectedOption] = useState('Include')

  return (
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
  )
}

export const BranchSettingsRuleDefaultBranchField: React.FC<FieldProps> = ({ register, errors, watch, setValue }) => (
  <FormFieldSet.ControlGroup className="flex flex-row">
    <Checkbox
      {...register('defaultBranchValue')}
      checked={watch('defaultBranchValue')}
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
)

export const BranchSettingsRuleBypassListField: React.FC<FieldProps> = ({
  register: __,
  watch,
  setValue,
  errors: _
}) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="bypassValue">Bypass list</FormFieldSet.Label>
    <Select
      value={watch('bypassValue')}
      onValueChange={value => setValue('bypassValue', value, { shouldValidate: true })}>
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
)

export const BranchSettingsRuleEditPermissionsField: React.FC<FieldProps> = ({ register, errors, watch, setValue }) => (
  <FormFieldSet.ControlGroup className="flex flex-row">
    <Checkbox
      {...register('editPermissionsValue')}
      checked={watch('editPermissionsValue')}
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
)

export const BranchSettingsRuleListField: React.FC<FieldProps> = ({ register: _, watch, setValue, errors: __ }) => {
  const handleCheckboxChange = (ruleId: string, checked: boolean) => {
    const updatedRules = watch('rules').map(r => (r.id === ruleId ? { ...r, checked } : r))
    setValue('rules', updatedRules)
  }
  const handleSubmenuChange = (ruleId: string, submenuId: string, checked: boolean) => {
    const updatedRules = watch('rules').map(rule => {
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
    const updatedRules = watch('rules').map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, selectOptions: selectedOptions }
      }
      return rule
    })
    setValue('rules', updatedRules)
  }
  return (
    <FormFieldSet.ControlGroup className="max-w-sm">
      <FormFieldSet.Label>Rules: select all that apply</FormFieldSet.Label>
      {rules.map((rule, index) => (
        <div key={rule.id}>
          <FormFieldSet.Option
            className="mt-0"
            control={
              <Checkbox
                id={rule.id}
                checked={watch('rules')[index]?.checked}
                onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
              />
            }
            id={rule.id}
            label={rule.label}
            description={rule.description}
          />

          {/* Conditionally render the submenu if this rule has a submenu and is checked */}
          {rule.hasSubmenu && watch('rules')[index].checked && (
            <div className="pl-6 mt-2">
              {rule.submenuOptions.map(subOption => (
                <FormFieldSet.Option
                  key={subOption.id}
                  control={
                    <Checkbox
                      id={subOption.id}
                      checked={watch('rules')[index].submenu?.includes(subOption.id)}
                      onCheckedChange={checked => handleSubmenuChange(rule.id, subOption.id, checked === true)}
                    />
                  }
                  id={subOption.id}
                  label={subOption.label}
                />
              ))}
            </div>
          )}

          {rule.hasSelect && watch('rules')[index].checked && (
            <div className="pl-6 mt-2">
              <Select
                value={watch('rules')[index].selectOptions}
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
  )
}
