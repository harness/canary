import { useState } from 'react'

import {
  Badge,
  Button,
  Checkbox,
  ControlGroup,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuGroup,
  // DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  // Fieldset,
  Icon,
  Input,
  Label,
  Message,
  MessageTheme,
  Option,
  ScrollArea,
  StackedList,
  Switch,
  Text,
  Textarea
} from '@/components'
import { MergeStrategy } from '@views/repo/pull-request'
import { TFunction } from 'i18next'

import { BypassUsersList, FieldProps, PatternsButtonType, Rule } from '../types'
import { getBranchRules } from './repo-branch-rules-data'

export const BranchSettingsRuleToggleField: React.FC<FieldProps> = ({ register, watch, setValue, t }) => (
  <StackedList.Root className="border-none">
    <StackedList.Item disableHover isHeader>
      <StackedList.Field
        title={t('views:repos.enableRule', 'Enable the rule')}
        description={t(
          'views:repos.enableRuleDescription',
          'By enabling the toggle, the branch rule will be enforced.'
        )}
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
  disabled,
  t
}) => (
  <ControlGroup>
    <Input
      id="name"
      label={t('views:repos.name', 'Name')}
      {...register!('identifier')}
      placeholder={t('views:repos.enterRuleName', 'Enter rule name')}
      autoFocus
      disabled={disabled}
      error={errors?.identifier?.message?.toString()}
    />
  </ControlGroup>
)

export const BranchSettingsRuleDescriptionField: React.FC<FieldProps> = ({ register, errors, t }) => (
  <ControlGroup>
    <Textarea
      label={t('views:repos.description', 'Description')}
      id="description"
      {...register!('description')}
      placeholder={t('views:repos.ruleDescriptionPlaceholder', 'Enter a description of this rule...')}
      error={errors?.description?.message?.toString()}
    />
  </ControlGroup>
)

export const BranchSettingsRuleTargetPatternsField: React.FC<FieldProps> = ({
  setValue,
  watch,
  register,
  errors,
  t
}) => {
  const [selectedOption, _setSelectedOption] = useState<PatternsButtonType.INCLUDE | PatternsButtonType.EXCLUDE>(
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
    <ControlGroup>
      <Label htmlFor="target-patterns" className="mb-2.5" color="secondary">
        {t('views:repos.targetPatterns', 'Target patterns')}
      </Label>
      <div className="grid grid-cols-5 grid-rows-1">
        <div className="col-span-4 mr-2">
          <Input
            id="pattern"
            {...register!('pattern')}
            // label="Target Patterns"
            // caption="Match branches using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)"
            // leftStyle={true}
            // left={
            //   <Button
            //     variant="split"
            //     type="button"
            //     className="min-w-28 px-0"
            //     dropdown={
            //       <DropdownMenu key="dropdown-menu">
            //         <span>
            //           <DropdownMenuTrigger insideSplitButton>
            //             <Icon name="chevron-down" className="chevron-down" />
            //           </DropdownMenuTrigger>
            //         </span>
            //         <DropdownMenuContent align="end" className="mt-1">
            //           <DropdownMenuGroup>
            //             <DropdownMenuItem onSelect={() => setSelectedOption(PatternsButtonType.INCLUDE)}>
            //               Include
            //             </DropdownMenuItem>
            //             <DropdownMenuItem onSelect={() => setSelectedOption(PatternsButtonType.EXCLUDE)}>
            //               Exclude
            //             </DropdownMenuItem>
            //           </DropdownMenuGroup>
            //         </DropdownMenuContent>
            //       </DropdownMenu>
            //     }
            //   >
            //     {selectedOption}
            //   </Button>
            // }
          />
        </div>
        <Button variant="outline" type="button" className="col-span-1" onClick={handleAddPattern}>
          {t('views:repos.add', 'Add')}
        </Button>
        {errors!.pattern && <Message theme={MessageTheme.ERROR}>{errors!.pattern.message?.toString()}</Message>}
      </div>
      <Text size={2} as="p" color="tertiaryBackground" className="max-w-full mt-2.5">
        {t(
          'views:repos.createRuleCaption',
          'Match branches using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)'
        )}
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
    </ControlGroup>
  )
}

export const BranchSettingsRuleDefaultBranchField: React.FC<FieldProps> = ({
  register,
  errors,
  watch,
  setValue,
  t
}) => (
  <ControlGroup>
    <Option
      control={
        <Checkbox
          {...register!('default')}
          checked={watch!('default')}
          onCheckedChange={() => setValue!('default', !watch!('default'))}
          id="default-branch"
        />
      }
      id="default-branch"
      label={t('views:repos.applyRuleDefaultBranch', 'Apply this rule to the default branch')}
      className="mt-0"
    />

    {errors!.default && <Message theme={MessageTheme.ERROR}>{errors!.default.message?.toString()}</Message>}
  </ControlGroup>
)

export const BranchSettingsRuleBypassListField: React.FC<FieldProps & { bypassOptions: BypassUsersList[] }> = ({
  watch,
  setValue,
  bypassOptions,
  t
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
    : t('views:repos.selectUsers', 'Select Users')

  return (
    <ControlGroup>
      <Label className="mb-2.5" htmlFor="bypassValue">
        {t('views:repos.bypassList', 'Bypass list')}
      </Label>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-between rounded-md border w-full">
          <Text className="p-2" color={selectedBypassUsers.length ? 'primary' : 'tertiaryBackground'}>
            {triggerText}
          </Text>
          <Icon name="chevron-down" className="mr-2 chevron-down" />
        </DropdownMenuTrigger>

        <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
          <DropdownMenuLabel>{t('views:repos.users', 'Users')}</DropdownMenuLabel>
          <ScrollArea className="h-[300px]">
            <DropdownMenuSeparator />
            {bypassOptions &&
              bypassOptions.map(option => {
                return (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    onCheckedChange={() => handleCheckboxChange(option.id)}
                    checked={selectedBypassUsers.includes(option.id)}
                    onSelect={event => event.preventDefault()}
                    className="overflow-hidden"
                  >
                    {option.display_name}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </ControlGroup>
  )
}

export const BranchSettingsRuleEditPermissionsField: React.FC<FieldProps> = ({
  register,
  errors,
  watch,
  setValue,
  t
}) => (
  <ControlGroup className="min-h-8 justify-center">
    <Option
      control={
        <Checkbox
          {...register!('repo_owners')}
          checked={watch!('repo_owners')}
          onCheckedChange={() => setValue!('repo_owners', !watch!('repo_owners'))}
          id="edit-permissons"
        />
      }
      id="edit-permissons"
      label={t(
        'views:repos.editPermissionsCheckboxDescription',
        'Allow users with edit permission on the repository to bypass'
      )}
      className="mt-0"
    />

    {errors!.repo_owners && <Message theme={MessageTheme.ERROR}>{errors!.repo_owners.message?.toString()}</Message>}
  </ControlGroup>
)

export const BranchSettingsRuleListField: React.FC<{
  rules: Rule[]
  recentStatusChecks?: string[] | null
  handleCheckboxChange: (ruleId: string, checked: boolean) => void
  handleSubmenuChange: (ruleId: string, subOptionId: string, checked: boolean) => void
  handleSelectChangeForRule: (ruleId: string, check: string) => void
  handleInputChange: (ruleId: string, value: string) => void
  t: TFunction
}> = ({
  rules,
  recentStatusChecks,
  handleCheckboxChange,
  handleSubmenuChange,
  handleSelectChangeForRule,
  handleInputChange,
  t
}) => {
  const branchRules = getBranchRules(t)
  return (
    <ControlGroup className="max-w-sm">
      <Label className="mb-5">{t('views:repos.rulesTitle', 'Rules: select all that apply')}</Label>
      {branchRules.map((rule, index) => (
        <div key={rule.id}>
          <Option
            className="mb-5"
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
                <Option
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
                  <DropdownMenuLabel>{t('views:repos.statusChecks', 'Status Checks')}</DropdownMenuLabel>
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
                placeholder={t('views:repos.enterMinReviewers', 'Enter minimum number of reviewers')}
                value={rules[index].input || ''}
                onChange={e => handleInputChange(rule.id, e.target.value)}
              />
            </div>
          )}
        </div>
      ))}
    </ControlGroup>
  )
}
