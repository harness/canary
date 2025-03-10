import { FC, useCallback, useMemo, useState } from 'react'

import {
  Avatar,
  Button,
  ButtonWithOptions,
  Checkbox,
  ControlGroup,
  Fieldset,
  Icon,
  Input,
  MultiSelect,
  MultiSelectOptionType,
  Option,
  StackedList,
  Switch,
  Textarea
} from '@/components'
import { PrincipalType } from '@/types'
import { FieldProps, getBranchRules, MergeStrategy, PatternsButtonType, Rule } from '@/views'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'
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
          {...register('state')}
          checked={watch('state')}
          onCheckedChange={() => setValue('state', watch('state'))}
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

export const BranchSettingsRuleNameField: FC<FieldProps & { disabled: boolean }> = ({
  register,
  errors,
  disabled,
  t
}) => (
  <Input
    id="name"
    label={t('views:repos.name', 'Name')}
    {...register('identifier')}
    placeholder={t('views:repos.enterRuleName', 'Enter the rule name here')}
    autoFocus
    disabled={disabled}
    error={errors?.identifier?.message?.toString()}
    size="md"
  />
)

export const BranchSettingsRuleDescriptionField: FC<FieldProps> = ({ register, errors, t }) => (
  <Textarea
    label={t('views:repos.description', 'Description')}
    id="description"
    {...register('description')}
    placeholder={t('views:repos.ruleDescriptionPlaceholder', 'Enter the description here')}
    error={errors?.description?.message?.toString()}
  />
)

export const BranchSettingsRuleTargetPatternsField: FC<FieldProps> = ({ setValue, watch, register, errors, t }) => {
  const [selectedOption, setSelectedOption] = useState<PatternsButtonType>(PatternsButtonType.INCLUDE)

  const patterns = watch('patterns') || []

  const handleAddPattern = () => {
    const pattern = watch('pattern')
    if (pattern && !patterns.some(p => p.pattern === pattern)) {
      setValue('patterns', [...patterns, { pattern, option: selectedOption }])
      setValue('pattern', '')
    }
  }

  const handleRemovePattern = (patternVal: string) => {
    const updatedPatterns = patterns.filter(({ pattern }) => pattern !== patternVal)
    setValue('patterns', updatedPatterns)
  }

  return (
    <Fieldset className="gap-y-4" legend="Target patterns">
      <ControlGroup>
        <div className="grid grid-cols-[1fr_112px] items-start gap-x-3.5">
          <Input
            id="pattern"
            size="md"
            label={t('views:repos.targetPatterns', 'Target patterns')}
            {...register('pattern')}
            caption={t(
              'views:repos.createRuleCaption',
              'Match branches using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)'
            )}
            placeholder={t('views:repos.rulePatternPlaceholder', 'Enter the target patterns')}
            error={errors?.pattern?.message?.toString()}
          />
          <ButtonWithOptions<PatternsButtonType>
            buttonClassName="px-0 w-full"
            id="patterns-type"
            size="md"
            className="mt-6"
            handleButtonClick={handleAddPattern}
            selectedValue={selectedOption}
            handleOptionChange={setSelectedOption}
            options={[
              {
                value: PatternsButtonType.INCLUDE,
                label: t(`views:repos.ruleTarget.include`, 'Include')
              },
              {
                value: PatternsButtonType.EXCLUDE,
                label: t(`views:repos.ruleTarget.exclude`, 'Exclude')
              }
            ]}
          >
            {selectedOption === PatternsButtonType.INCLUDE && t(`views:repos.ruleTarget.include`, 'Include')}
            {selectedOption === PatternsButtonType.EXCLUDE && t(`views:repos.ruleTarget.exclude`, 'Exclude')}
          </ButtonWithOptions>
        </div>
        {!!patterns.length && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {patterns.map(pattern => (
              <Button
                key={pattern.pattern}
                className="bg-background-8 text-foreground-8 group flex h-6 items-center gap-x-1.5 px-2.5"
                type="button"
                variant="custom"
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

                <Icon
                  className="text-icons-1 group-hover:text-foreground-1 rotate-45 transition-colors"
                  name="plus"
                  size={10}
                />
              </Button>
            ))}
          </div>
        )}
      </ControlGroup>

      <Option
        control={
          <Checkbox
            {...register('default')}
            checked={watch('default')}
            onCheckedChange={() => setValue('default', watch('default'))}
            id="default-branch"
          />
        }
        id="default-branch"
        label={t('views:repos.applyRuleDefaultBranch', 'Apply this rule to the default branch')}
        error={errors?.default && errors?.default?.message?.toString()}
      />
    </Fieldset>
  )
}

const BranchSettingsRuleBypassListOption = (option: MultiSelectOptionType<PrincipalType>) => {
  return (
    <>
      <Avatar.Root>
        {!!option?.avatar_url && <Avatar.Image src={option.avatar_url} alt={option.display_name} />}
        <Avatar.Fallback>{getInitials(option.display_name)}</Avatar.Fallback>
      </Avatar.Root>
      <span className="font-medium">{option.display_name}</span>
    </>
  )
}

export const BranchSettingsRuleBypassListField: FC<
  FieldProps & {
    bypassOptions: PrincipalType[] | null
    setPrincipalsSearchQuery: (val: string) => void
    principalsSearchQuery: string
  }
> = ({ watch, setValue, bypassOptions, t, register, errors, setPrincipalsSearchQuery, principalsSearchQuery }) => {
  const selectedBypassUsers = watch('bypass').map(user => ({
    ...user,
    label: user.display_name
  }))

  const handleCheckboxChange = useCallback(
    (option: MultiSelectOptionType<Partial<PrincipalType>>) => {
      const selectedIds = selectedBypassUsers.map(it => it.id)

      setValue(
        'bypass',
        selectedIds.includes(Number(option.id))
          ? selectedBypassUsers.filter(item => item.id !== option.id)
          : [
              ...selectedBypassUsers,
              {
                id: option.id,
                display_name: option.label
              }
            ],
        { shouldValidate: true }
      )
    },
    [selectedBypassUsers, setValue]
  )

  const multiSelectOptions: MultiSelectOptionType<PrincipalType>[] = useMemo(() => {
    return (
      bypassOptions?.map(option => ({
        ...option,
        id: option.id!,
        label: option.display_name
      })) || []
    )
  }, [bypassOptions])

  return (
    <Fieldset className="gap-y-4" legend="Bypass list">
      <MultiSelect<PrincipalType>
        selectedItems={selectedBypassUsers}
        t={t}
        label={t('views:repos.bypassList', 'Bypass list')}
        placeholder={t('views:repos.selectUsers', 'Select users')}
        handleChange={handleCheckboxChange}
        options={multiSelectOptions}
        searchValue={principalsSearchQuery}
        handleChangeSearchValue={setPrincipalsSearchQuery}
        customOptionElem={BranchSettingsRuleBypassListOption}
      />

      <Option
        control={
          <Checkbox
            {...register('repo_owners')}
            checked={watch('repo_owners')}
            onCheckedChange={() => setValue('repo_owners', watch('repo_owners'))}
            id="edit-permissions"
          />
        }
        id="edit-permissions"
        label={t(
          'views:repos.editPermissionsCheckboxDescription',
          'Allow users with edit permission on the repository to bypass'
        )}
        error={errors?.repo_owners && errors?.repo_owners?.message?.toString()}
      />
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
    <Fieldset className="grid max-w-[476px] gap-5">
      <legend className="mb-6" color="secondary">
        {t('views:repos.rulesTitle', 'Rules: select all that apply')}
      </legend>

      {branchRules.map((rule, index) => {
        const isChecked = rules[index]?.checked ?? false

        return (
          <div key={rule.id} className="grid gap-y-4">
            <Option
              control={
                <Checkbox
                  id={rule.id}
                  checked={isChecked}
                  onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
                />
              }
              id={rule.id}
              label={rule.label}
              description={rule.description}
            />

            {/* Conditionally render the submenu if this rule has a submenu and is checked */}
            {!!rule?.submenuOptions && !!rule?.submenuOptions.length && isChecked && (
              <div className="grid gap-y-4 pl-[26px]">
                {rule.submenuOptions.map(subOption => (
                  <Option
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
              <Input
                id="name"
                size="md"
                className="ml-[26px]"
                placeholder={t('views:repos.enterMinReviewers', 'Enter minimum number of reviewers')}
                value={rules[index].input || ''}
                onChange={e => handleInputChange(rule.id, e.target.value)}
              />
            )}
          </div>
        )
      })}
    </Fieldset>
  )
}
