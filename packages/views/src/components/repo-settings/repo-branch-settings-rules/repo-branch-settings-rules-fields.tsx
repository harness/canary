import { useState } from 'react'

import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Input,
  StackedList,
  Switch,
  Text
} from '@harnessio/canary'
import { Textarea } from '@harnessio/ui/components'

import { FormFieldSet, MessageTheme } from '../../../index'
import { branchRules } from './repo-branch-settings-rules-data'
import {
  BranchRulesActionType,
  BypassUsersList,
  Dispatch,
  FieldProps,
  MergeStrategy,
  PatternsButtonType,
  Rule
} from './types'

export const BranchSettingsRuleToggleField: React.FC<FieldProps> = ({ register, watch, setValue }) => (
  <StackedList.Root className="border-none">
    <StackedList.Item disableHover isHeader>
      <StackedList.Field
        title="Enable the rule"
        description="By enabling the toggle, the branch rule will be enforced."
      />
      <StackedList.Field
        label
        secondary
        title={
          <div className="flex cursor-pointer items-center justify-end gap-1.5">
            <Switch
              {...register!('state')}
              checked={watch!('state')}
              onCheckedChange={() => setValue!('state', !watch!('state'))}
            />
          </div>
        }
        right
      />
    </StackedList.Item>
  </StackedList.Root>
)

export const BranchSettingsRuleNameField: React.FC<FieldProps & { disabled: boolean }> = ({
  register,
  errors,
  disabled
}) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="identifier" required>
      Name
    </FormFieldSet.Label>
    <Input id="name" {...register!('identifier')} placeholder="Enter rule name" autoFocus disabled={disabled} />
    {errors!.identifier && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.identifier.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const BranchSettingsRuleDescriptionField: React.FC<FieldProps> = ({ register, errors }) => (
  <FormFieldSet.ControlGroup>
    <FormFieldSet.Label htmlFor="description" required>
      Description
    </FormFieldSet.Label>
    <Textarea id="description" {...register!('description')} placeholder="Enter a description of this rule..." />
    {errors!.description && (
      <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.description.message?.toString()}</FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const BranchSettingsRuleTargetPatternsField: React.FC<FieldProps> = ({ setValue, watch, register, errors }) => {
  const [selectedOption, setSelectedOption] = useState<PatternsButtonType.INCLUDE | PatternsButtonType.EXCLUDE>(
    PatternsButtonType.INCLUDE
  )

  const patterns = watch!('patterns') || []

  const handleAddPattern = () => {
    const pattern = watch!('pattern')
    if (pattern && !patterns.some(p => p.pattern === pattern)) {
      setValue!('patterns', [...patterns, { pattern, option: selectedOption }])
      setValue!('pattern', '')
    }
  }

  const handleRemovePattern = (patternVal: string) => {
    const updatedPatterns = patterns.filter(({ pattern }) => pattern !== patternVal)
    setValue!('patterns', updatedPatterns)
  }

  return (
    <FormFieldSet.ControlGroup>
      <FormFieldSet.Label htmlFor="target-patterns">Target Patterns</FormFieldSet.Label>
      <div className="grid grid-cols-5 grid-rows-1">
        <div className="col-span-4 mr-2">
          <Input
            id="pattern"
            {...register!('pattern')}
            leftStyle={true}
            left={
              <Button
                variant="split"
                type="button"
                className="min-w-28 px-0"
                dropdown={
                  <DropdownMenu key="dropdown-menu">
                    <span>
                      <DropdownMenuTrigger insideSplitButton>
                        <Icon name="chevron-down" className="chevron-down" />
                      </DropdownMenuTrigger>
                    </span>
                    <DropdownMenuContent align="end" className="mt-1">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setSelectedOption(PatternsButtonType.INCLUDE)}>
                          Include
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSelectedOption(PatternsButtonType.EXCLUDE)}>
                          Exclude
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              >
                {selectedOption}
              </Button>
            }
          />
        </div>
        <Button variant="outline" type="button" className="col-span-1" onClick={handleAddPattern}>
          Add
        </Button>
        {errors!.pattern && (
          <FormFieldSet.Message theme={MessageTheme.ERROR}>{errors!.pattern.message?.toString()}</FormFieldSet.Message>
        )}
      </div>
      <Text size={2} as="p" color="tertiaryBackground" className="max-w-full">
        Match branches using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)
      </Text>
      <div className="flex flex-wrap">
        {patterns &&
          patterns.map(pattern => (
            <Badge
              variant="outline"
              theme={pattern.option === PatternsButtonType.INCLUDE ? 'success' : 'destructive'}
              key={pattern.pattern}
              className="m-1 inline-flex"
            >
              {pattern.pattern}
              <button className="ml-2" onClick={() => handleRemovePattern(pattern.pattern)}>
                <Icon name="x-mark" size={12} className="text-current" />
              </button>
            </Badge>
          ))}
      </div>
    </FormFieldSet.ControlGroup>
  )
}

export const BranchSettingsRuleDefaultBranchField: React.FC<FieldProps> = ({ register, errors, watch, setValue }) => (
  <FormFieldSet.ControlGroup className="min-h-8 justify-center">
    <FormFieldSet.Option
      control={
        <Checkbox
          {...register!('default')}
          checked={watch!('default')}
          onCheckedChange={() => setValue!('default', !watch!('default'))}
          id="default-branch"
        />
      }
      id="default-branch"
      label="Default Branch"
      className="mt-0"
    />

    {errors!.default && (
      <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
        {errors!.default.message?.toString()}
      </FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const BranchSettingsRuleBypassListField: React.FC<FieldProps & { bypassOptions: BypassUsersList[] }> = ({
  watch,
  setValue,
  bypassOptions
}) => {
  const selectedBypassUsers = watch!('bypass') || []

  const handleCheckboxChange = (optionId: number) => {
    setValue!(
      'bypass',
      selectedBypassUsers.includes(optionId)
        ? selectedBypassUsers.filter(item => item !== optionId)
        : [...selectedBypassUsers, optionId],
      { shouldValidate: true }
    )
  }
  const triggerText = selectedBypassUsers.length
    ? selectedBypassUsers
        .map(id => bypassOptions.find(option => option.id === id)?.display_name)
        .filter(Boolean)
        .join(', ')
    : 'Select Users'

  return (
    <FormFieldSet.ControlGroup>
      <FormFieldSet.Label htmlFor="bypassValue">Bypass list</FormFieldSet.Label>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center justify-between rounded-md border">
            <Button variant="ghost" className="w-full">
              <Text color={selectedBypassUsers.length ? 'primary' : 'tertiaryBackground'}>{triggerText}</Text>
            </Button>
            <Icon name="chevron-down" className="mr-2" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
          <DropdownMenuLabel>Users</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {bypassOptions &&
            bypassOptions.map(option => {
              return (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  onCheckedChange={() => handleCheckboxChange(option.id)}
                  checked={selectedBypassUsers.includes(option.id)}
                  onSelect={event => event.preventDefault()}
                >
                  {option.display_name}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </FormFieldSet.ControlGroup>
  )
}

export const BranchSettingsRuleEditPermissionsField: React.FC<FieldProps> = ({ register, errors, watch, setValue }) => (
  <FormFieldSet.ControlGroup className="min-h-8 justify-center">
    <FormFieldSet.Option
      control={
        <Checkbox
          {...register!('repo_owners')}
          checked={watch!('repo_owners')}
          onCheckedChange={() => setValue!('repo_owners', !watch!('repo_owners'))}
          id="edit-permissons"
        />
      }
      id="edit-permissons"
      label="Allow users with edit permission on the repository to bypass"
      className="mt-0"
    />

    {errors!.repo_owners && (
      <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
        {errors!.repo_owners.message?.toString()}
      </FormFieldSet.Message>
    )}
  </FormFieldSet.ControlGroup>
)

export const BranchSettingsRuleListField: React.FC<{
  rules: Rule[]
  dispatch: Dispatch
  recentStatusChecks?: string[]
}> = ({ rules, dispatch, recentStatusChecks }) => {
  const handleCheckboxChange = (ruleId: string, checked: boolean) => {
    dispatch({ type: BranchRulesActionType.TOGGLE_RULE, ruleId, checked })
  }

  const handleSubmenuChange = (ruleId: string, submenuId: string, checked: boolean) => {
    dispatch({ type: BranchRulesActionType.TOGGLE_SUBMENU, ruleId, submenuId, checked })
  }

  const handleSelectChangeForRule = (ruleId: string, checkName: string) => {
    dispatch({ type: BranchRulesActionType.SET_SELECT_OPTION, ruleId, checkName })
  }

  const handleInputChange = (ruleId: string, value: string) => {
    dispatch({ type: BranchRulesActionType.SET_INPUT_VALUE, ruleId, value })
  }

  return (
    <FormFieldSet.ControlGroup className="max-w-sm">
      <FormFieldSet.Label>Rules: select all that apply</FormFieldSet.Label>
      {branchRules.map((rule, index) => (
        <div key={rule.id}>
          <FormFieldSet.Option
            className="mt-0"
            control={
              <Checkbox
                id={rule.id}
                checked={rules[index]?.checked}
                onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
              />
            }
            id={rule.id}
            label={rule.label}
            description={rule.description}
          />

          {/* Conditionally render the submenu if this rule has a submenu and is checked */}
          {rule.hasSubmenu && rules[index].checked && (
            <div className="mb-4 pl-8">
              {rule.submenuOptions.map(subOption => (
                <FormFieldSet.Option
                  className="min-h-6"
                  key={subOption.id}
                  control={
                    <Checkbox
                      id={subOption.id}
                      checked={rules[index].submenu?.includes(subOption.id as MergeStrategy)}
                      onCheckedChange={checked => handleSubmenuChange(rule.id, subOption.id, checked === true)}
                    />
                  }
                  id={subOption.id}
                  label={subOption.label}
                />
              ))}
            </div>
          )}

          {rule.hasSelect && rules[index].checked && (
            <div className="mb-4 mt-2 w-full pl-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <div className="flex items-center justify-between rounded-md border">
                    <Button variant="ghost" className="w-full">
                      <Text color={rules[index].selectOptions?.length ? 'primary' : 'tertiaryBackground'}>
                        {rules[index].selectOptions?.length
                          ? rules[index].selectOptions.join(', ')
                          : 'Select Status Checks'}
                      </Text>
                    </Button>
                    <Icon name="chevron-down" className="mr-2" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                  <DropdownMenuLabel>Status Checks</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {recentStatusChecks?.map(checks => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={checks}
                        checked={rules[index].selectOptions?.includes(checks)}
                        onCheckedChange={() => handleSelectChangeForRule(rule.id, checks)}
                        onSelect={e => e.preventDefault()}
                      >
                        {checks}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {rule.hasInput && rules[index].checked && (
            <div className="mt-2 pl-8">
              <Input
                id="name"
                placeholder="Enter minimum number of reviewers"
                value={rules[index].input || ''}
                onChange={e => handleInputChange(rule.id, e.target.value)}
              />
            </div>
          )}
        </div>
      ))}
    </FormFieldSet.ControlGroup>
  )
}
