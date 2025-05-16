import { FC, useMemo, useState } from 'react'

import {
  Button,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormInput,
  Icon,
  Input,
  Label,
  Message,
  MessageTheme,
  MultiSelect,
  MultiSelectV2,
  SplitButton,
  StackedList,
  Switch,
  Textarea
} from '@/components'
import { PrincipalType } from '@/types'
import { FieldProps, getBranchRules, MergeStrategy, PatternsButtonType, Rule } from '@/views'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

export const BranchSettingsRuleToggleField: FC<FieldProps> = ({ register, watch, setValue, t }) => (
  <StackedList.Root className="overflow-hidden" borderBackground>
    <StackedList.Item
      className="!rounded px-5 py-3"
      disableHover
      isHeader
      isLast
      actions={
        <Switch
          {...register!('state')}
          checked={watch!('state')}
          onCheckedChange={() => setValue!('state', !watch!('state'))}
        />
      }
    >
      <StackedList.Field
        title={t('views:repos.enableRule', 'Enable the rule')}
        description={t(
          'views:repos.enableRuleDescription',
          'By enabling the toggle, the branch rule will be enforced.'
        )}
      />
    </StackedList.Item>
  </StackedList.Root>
)

export const BranchSettingsRuleNameField: FC<FieldProps & { disabled: boolean }> = ({ register, disabled, t }) => (
  <ControlGroup>
    <FormInput.Text
      id="name"
      label={t('views:repos.name', 'Name')}
      {...register!('identifier')}
      placeholder={t('views:repos.enterRuleName', 'Enter the rule name here')}
      autoFocus
      disabled={disabled}
    />
  </ControlGroup>
)

export const BranchSettingsRuleDescriptionField: FC<FieldProps> = ({ register, errors, t }) => (
  <ControlGroup>
    <Textarea
      label={t('views:repos.description', 'Description')}
      id="description"
      {...register!('description')}
      placeholder={t('views:repos.ruleDescriptionPlaceholder', 'Enter the description here')}
      error={errors?.description?.message?.toString()}
    />
  </ControlGroup>
)

export const BranchSettingsRuleTargetPatternsField: FC<FieldProps> = ({ setValue, watch, register, errors, t }) => {
  const [selectedOption, setSelectedOption] = useState<PatternsButtonType>(PatternsButtonType.INCLUDE)

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
    <Fieldset className="gap-y-4">
      <ControlGroup>
        <Label htmlFor="target-patterns" className="mb-2">
          {t('views:repos.targetPatterns', 'Target patterns')}
        </Label>
        <div className="grid grid-cols-[1fr_112px] items-start gap-x-3.5">
          <FormInput.Text
            id="pattern"
            {...register!('pattern')}
            caption={t(
              'views:repos.createRuleCaption',
              'Match branches using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)'
            )}
            placeholder={t('views:repos.rulePatternPlaceholder', 'Enter the target patterns')}
          />
          <SplitButton<PatternsButtonType>
            buttonClassName="px-0 w-full"
            id="patterns-type"
            handleButtonClick={handleAddPattern}
            selectedValue={selectedOption}
            handleOptionChange={setSelectedOption}
            options={[
              {
                value: PatternsButtonType.INCLUDE,
                label: t(`views:repos.include`, 'Include')
              },
              {
                value: PatternsButtonType.EXCLUDE,
                label: t(`views:repos.exclude`, 'Exclude')
              }
            ]}
          >
            {t(`views:repos.${selectedOption.toLowerCase()}`, `${selectedOption}`)}
          </SplitButton>
        </div>
        {!!patterns.length && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {patterns.map(pattern => (
              <Button
                key={pattern.pattern}
                className="group flex h-6 items-center gap-x-1.5"
                size="sm"
                type="button"
                variant="secondary"
                onClick={() => handleRemovePattern(pattern.pattern)}
              >
                <span className="flex items-center gap-1">
                  <Icon
                    className={cn('text-icons-success', {
                      'rotate-45 text-icons-danger': pattern.option !== PatternsButtonType.INCLUDE
                    })}
                    name="circle-plus"
                    size={10}
                  />
                  {pattern.pattern}
                </span>
                <Icon className="rotate-45" name="plus" size={10} />
              </Button>
            ))}
          </div>
        )}
      </ControlGroup>

      <ControlGroup>
        <Checkbox
          id="default-branch"
          {...register!('default')}
          checked={watch!('default')}
          onCheckedChange={() => setValue!('default', !watch!('default'))}
          label={t('views:repos.applyRuleDefaultBranch', 'Apply this rule to the default branch')}
        />

        {!!errors?.default && <Message theme={MessageTheme.ERROR}>{errors?.default?.message?.toString()}</Message>}
      </ControlGroup>
    </Fieldset>
  )
}

// const BranchSettingsRuleBypassListOption = (option: MultiSelectOptionType<PrincipalType>) => {
//   return (
//     <>
//       <Avatar name={option.display_name} src={option.avatar_url} rounded />
//       <span className="font-medium">{option.display_name}</span>
//     </>
//   )
// }

export const BranchSettingsRuleBypassListField: FC<
  FieldProps & {
    bypassOptions: PrincipalType[] | null
    setPrincipalsSearchQuery: (val: string) => void
    principalsSearchQuery: string
  }
> = ({ watch, setValue, bypassOptions, t, register, errors, setPrincipalsSearchQuery, principalsSearchQuery }) => {
  const multiSelectOptions: MultiSelectV2.MultiSelectOption[] = useMemo(() => {
    return (
      bypassOptions?.map(option => ({
        id: option.id!,
        key: option.display_name
      })) || []
    )
  }, [bypassOptions])

  return (
    <Fieldset className="gap-y-4">
      <ControlGroup>
        <FormInput.MultiSelect
          label={t('views:repos.bypassList', 'Bypass list')}
          name="bypass"
          options={multiSelectOptions}
          placeholder={t('views:repos.selectUsers', 'Select users')}
          searchQuery={principalsSearchQuery}
          setSearchQuery={setPrincipalsSearchQuery}
          disallowCreation
        />
      </ControlGroup>

      <ControlGroup>
        <Checkbox
          {...register!('repo_owners')}
          checked={watch!('repo_owners')}
          onCheckedChange={() => setValue!('repo_owners', !watch!('repo_owners'))}
          id="edit-permissons"
          label={t(
            'views:repos.editPermissionsCheckboxDescription',
            'Allow users with edit permission on the repository to bypass'
          )}
        />

        {errors!.repo_owners && <Message theme={MessageTheme.ERROR}>{errors!.repo_owners.message?.toString()}</Message>}
      </ControlGroup>
    </Fieldset>
  )
}

export const BranchSettingsRuleListField: FC<{
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
    <ControlGroup className="max-w-[476px]">
      <Label className="mb-6">{t('views:repos.rulesTitle', 'Rules: select all that apply')}</Label>
      <Fieldset className="gap-y-5">
        {branchRules.map((rule, index) => {
          const isChecked = rules[index]?.checked ?? false

          return (
            <Fieldset key={rule.id} className="gap-y-4">
              <Checkbox
                id={rule.id}
                checked={isChecked}
                onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
                label={rule.label}
                caption={rule.description}
              />

              {/* Conditionally render the submenu if this rule has a submenu and is checked */}
              {!!rule?.submenuOptions && !!rule?.submenuOptions.length && isChecked && (
                <Fieldset className="gap-y-4 pl-[26px]">
                  {rule.submenuOptions.map(subOption => (
                    <Checkbox
                      key={subOption.id}
                      id={subOption.id}
                      checked={rules[index].submenu?.includes(subOption.id as MergeStrategy)}
                      onCheckedChange={checked => handleSubmenuChange(rule.id, subOption.id, checked === true)}
                      label={subOption.label}
                    />
                  ))}
                </Fieldset>
              )}

              {!!rule?.hasSelect && isChecked && (
                <MultiSelect
                  className="pl-[26px]"
                  selectedItems={rules[index].selectOptions.map(option => ({ id: option, label: option }))}
                  t={t}
                  placeholder={t('views:repos.selectStatusesPlaceholder', 'Select status checks')}
                  handleChange={val => handleSelectChangeForRule(rule.id, val.label)}
                  options={recentStatusChecks?.map(check => ({ id: check, label: check })) ?? []}
                />
              )}

              {!!rule?.hasInput && isChecked && (
                <div className="pl-[26px]">
                  <Input
                    id="name"
                    size="md"
                    placeholder={t('views:repos.enterMinReviewers', 'Enter minimum number of reviewers')}
                    value={rules[index].input || ''}
                    onChange={e => handleInputChange(rule.id, e.target.value)}
                  />
                </div>
              )}
            </Fieldset>
          )
        })}
      </Fieldset>
    </ControlGroup>
  )
}
