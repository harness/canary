import { FC, useMemo, useState } from 'react'

import {
  Button,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormInput,
  IconV2,
  Input,
  Label,
  Message,
  MessageTheme,
  MultiSelect,
  MultiSelectOption,
  SplitButton,
  Switch
} from '@/components'
import { useTranslation } from '@/context'
import { PrincipalType } from '@/types'
import {
  BranchRuleId,
  EnumBypassListType,
  FieldProps,
  getBranchRules,
  MergeStrategy,
  NormalizedPrincipal,
  PatternsButtonType,
  Rule
} from '@/views'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import clsx from 'clsx'
import { isEmpty } from 'lodash-es'

import { getIcon } from '../utils'

export const BranchSettingsRuleToggleField: FC<FieldProps> = ({ register, watch, setValue }) => {
  const { t } = useTranslation()
  return (
    <Switch
      {...register!('state')}
      checked={watch!('state')}
      onCheckedChange={() => setValue!('state', !watch!('state'))}
      label={t('views:repos.enableRule', 'Enable the rule')}
      caption={t('views:repos.enableRuleDescription', 'By enabling the toggle, the branch rule will be enforced.')}
    />
  )
}

export const BranchSettingsRuleNameField: FC<FieldProps & { disabled: boolean }> = ({ register, disabled }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Text
      id="name"
      label={t('views:repos.name', 'Name')}
      {...register!('identifier')}
      placeholder={t('views:repos.enterRuleName', 'Enter the rule name here')}
      autoFocus
      disabled={disabled}
    />
  )
}

export const BranchSettingsRuleDescriptionField: FC<FieldProps> = ({ register }) => {
  const { t } = useTranslation()
  return (
    <FormInput.Textarea
      label={t('views:repos.description', 'Description')}
      id="description"
      {...register!('description')}
      placeholder={t('views:repos.ruleDescriptionPlaceholder', 'Enter the description here')}
      className="h-[136px]"
    />
  )
}

export const BranchSettingsRuleTargetPatternsField: FC<FieldProps> = ({ setValue, watch, register, errors }) => {
  const { t } = useTranslation()

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
        <Label htmlFor="target-patterns">{t('views:repos.targetPatterns', 'Target patterns')}</Label>
        <div className="grid grid-cols-[1fr_126px] items-start gap-x-3.5">
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
            // buttonClassName="px-0 w-full"
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
                  <IconV2
                    className={cn('text-icons-success', {
                      'rotate-45 text-icons-danger': pattern.option !== PatternsButtonType.INCLUDE
                    })}
                    name="plus-circle"
                    size="2xs"
                  />
                  {pattern.pattern}
                </span>
                <IconV2 name="xmark" size="2xs" />
              </Button>
            ))}
          </div>
        )}
      </ControlGroup>

      <ControlGroup>
        <FormInput.Checkbox
          id="default-branch"
          {...register!('default')}
          label={t('views:repos.applyRuleDefaultBranch', 'Apply this rule to the default branch')}
        />

        {!!errors?.default && <Message theme={MessageTheme.ERROR}>{errors?.default?.message?.toString()}</Message>}
      </ControlGroup>
    </Fieldset>
  )
}

export const BranchSettingsRuleBypassListField: FC<
  FieldProps & {
    bypassOptions: NormalizedPrincipal[] | null
    setPrincipalsSearchQuery: (val: string) => void
    principalsSearchQuery: string
    bypassListPlaceholder?: string
  }
> = ({ bypassOptions, register, errors, setPrincipalsSearchQuery, principalsSearchQuery, bypassListPlaceholder }) => {
  const { t } = useTranslation()
  const { search: debouncedPrincipalsSearchQuery, handleStringSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setPrincipalsSearchQuery,
    searchValue: principalsSearchQuery || ''
  })

  const multiSelectOptions: MultiSelectOption[] = useMemo(() => {
    return (
      bypassOptions?.map(option => ({
        id: option.id!,

        key: option.display_name || '',
        type: option.type,
        icon: getIcon(option.type as EnumBypassListType),
        title: option.email_or_identifier
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
          placeholder={bypassListPlaceholder || t('views:repos.selectUsers', 'Select users')}
          searchQuery={debouncedPrincipalsSearchQuery}
          setSearchQuery={handleStringSearchChange}
          disallowCreation
          error={errors?.bypass?.message?.toString()}
        />
      </ControlGroup>

      <ControlGroup>
        <FormInput.Checkbox
          {...register!('repo_owners')}
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

export const BranchSettingsRuleDefaultReviewersField: FC<
  FieldProps & {
    rule?: Rule
    defaultReviewersOptions?: PrincipalType[] | null
    principalsSearchQuery?: string
    setPrincipalsSearchQuery?: (val: string) => void
    handleSelectChangeForRule: (ruleId: string, options: MultiSelectOption[]) => void
  }
> = ({ defaultReviewersOptions, rule, setPrincipalsSearchQuery, principalsSearchQuery, handleSelectChangeForRule }) => {
  const { t } = useTranslation()
  const { validationMessage, selectOptions } = rule || {}
  const { search: debouncedPrincipalsSearchQuery, handleStringSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setPrincipalsSearchQuery,
    searchValue: principalsSearchQuery || ''
  })

  const multiSelectOptions: MultiSelectOption[] = useMemo(() => {
    return (
      defaultReviewersOptions?.map(option => ({
        id: option.id?.toString() || '',
        key: option.display_name || '',
        title: option.email
      })) || []
    )
  }, [defaultReviewersOptions])

  return (
    <>
      <MultiSelect
        value={selectOptions?.map(option => ({
          id: option.id?.toString() || '',
          key: option.key
        }))}
        placeholder={t('views:repos.selectDefaultReviewers', 'Select default reviewers')}
        onChange={options => {
          handleSelectChangeForRule(BranchRuleId.ENABLE_DEFAULT_REVIEWERS, options)
        }}
        options={multiSelectOptions}
        searchQuery={debouncedPrincipalsSearchQuery}
        setSearchQuery={handleStringSearchChange}
        disallowCreation
      />
      {validationMessage && !isEmpty(validationMessage.message) && (
        <Message theme={validationMessage.theme} className="mt-2">
          {validationMessage.theme === MessageTheme.WARNING
            ? t(`views:repos.${validationMessage.message}`)
            : validationMessage.message}
        </Message>
      )}
    </>
  )
}

export const BranchSettingsRuleListField: FC<{
  rules: Rule[]
  recentStatusChecks?: string[] | null
  defaultReviewersOptions?: PrincipalType[] | null
  handleCheckboxChange: (ruleId: string, checked: boolean) => void
  handleSubmenuChange: (ruleId: string, subOptionId: string, checked: boolean) => void
  handleSelectChangeForRule: (ruleId: string, checks: MultiSelectOption[]) => void
  handleInputChange: (ruleId: string, value: string) => void
  setPrincipalsSearchQuery?: (val: string) => void
  principalsSearchQuery?: string
}> = ({
  rules,
  recentStatusChecks,
  defaultReviewersOptions,
  handleCheckboxChange,
  handleSubmenuChange,
  handleSelectChangeForRule,
  handleInputChange,
  setPrincipalsSearchQuery,
  principalsSearchQuery
}) => {
  const { t } = useTranslation()
  const branchRules = getBranchRules(t)
  return (
    <ControlGroup>
      <Label className="mb-4">{t('views:repos.rulesTitle', 'Rules: select all that apply')}</Label>
      <Fieldset className="gap-y-4">
        {branchRules.map((rule, index) => {
          const matchingRule = rules.find(r => r.id === rule.id)
          const {
            checked: isChecked = false,
            disabled: isDisabled = false,
            hidden: isHidden = false
          } = matchingRule || {}

          return (
            !isHidden && (
              <Fieldset key={rule.id} className={clsx('gap-y-4', rule.isNested && 'pl-[26px]')}>
                <Checkbox
                  id={rule.id}
                  checked={isChecked}
                  onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
                  disabled={isDisabled}
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

                {!!rule?.hasSelect && isChecked && rule.id === BranchRuleId.STATUS_CHECKS && (
                  <div className="pl-[26px]">
                    <MultiSelect
                      value={rules[index].selectOptions.map(option => ({ id: option?.id, key: option?.key }))}
                      placeholder={t('views:repos.selectStatusesPlaceholder', 'Select status checks')}
                      onChange={options => {
                        handleSelectChangeForRule(rule.id, options)
                      }}
                      options={recentStatusChecks?.map(check => ({ id: check, key: check })) ?? []}
                      disallowCreation
                    />
                  </div>
                )}

                {!!rule?.hasSelect && isChecked && rule.id === BranchRuleId.ENABLE_DEFAULT_REVIEWERS && (
                  <div className="pl-[26px]">
                    <BranchSettingsRuleDefaultReviewersField
                      defaultReviewersOptions={defaultReviewersOptions}
                      rule={rules[index]}
                      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
                      principalsSearchQuery={principalsSearchQuery}
                      handleSelectChangeForRule={handleSelectChangeForRule}
                    />
                  </div>
                )}

                {!!rule?.hasInput && isChecked && (
                  <div className="pl-[26px]">
                    <Input
                      id="name"
                      size="md"
                      type="number"
                      placeholder={
                        rule.id === BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT
                          ? t('views:repos.enterMinDefaultReviewers', 'Enter minimum number of default reviewers')
                          : t('views:repos.enterMinReviewers', 'Enter minimum number of reviewers')
                      }
                      value={rules[index].input || ''}
                      onChange={e => handleInputChange(rule.id, e.target.value)}
                    />
                  </div>
                )}
              </Fieldset>
            )
          )
        })}
      </Fieldset>
    </ControlGroup>
  )
}
