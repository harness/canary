import { FC, Fragment, useMemo, useState } from 'react'

import {
  Checkbox,
  ControlGroup,
  Fieldset,
  FormInput,
  IconV2,
  Label,
  Layout,
  Message,
  MessageTheme,
  MultiSelect,
  MultiSelectOption,
  NumberInput,
  ResetTag,
  SplitButton,
  Switch,
  Text
} from '@/components'
import { Separator } from '@/components/separator'
import { useTranslation } from '@/context'
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
import { isEmpty } from 'lodash-es'

import { getIcon } from '../../utils'

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

export const BranchSettingsRuleTargetPatternsField: FC<
  Pick<FieldProps, 'errors' | 'register'> & {
    handleAdd: (option: PatternsButtonType) => void
    handleRemove: (pattern: string) => void
    patterns: { pattern: string; option: PatternsButtonType }[]
  }
> = ({ errors, register, handleAdd, handleRemove, patterns }) => {
  const { t } = useTranslation()

  const [selectedOption, setSelectedOption] = useState<PatternsButtonType>(PatternsButtonType.INCLUDE)

  return (
    <Layout.Grid gapY="md">
      <ControlGroup>
        <Label htmlFor="target-patterns">{t('views:repos.targetPatterns', 'Target patterns')}</Label>
        <Layout.Grid columns="1fr auto" className="grid grid-cols-[1fr_126px] items-start gap-x-3.5">
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
            handleButtonClick={() => handleAdd(selectedOption)}
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
            <IconV2 name={selectedOption === PatternsButtonType.INCLUDE ? 'plus-circle' : 'xmark-circle'} />
            {t(`views:repos.${selectedOption.toLowerCase()}`, `${selectedOption}`)}
          </SplitButton>
        </Layout.Grid>
      </ControlGroup>

      {!!patterns.length && (
        <Layout.Flex wrap="wrap" gap="xs">
          {patterns.map(({ pattern, option }) => (
            <ResetTag
              key={pattern}
              value={pattern}
              onReset={() => handleRemove(pattern)}
              icon={option === PatternsButtonType.INCLUDE ? 'plus-circle' : 'xmark-circle'}
              iconProps={{
                className: option === PatternsButtonType.INCLUDE ? '!text-cn-success' : '!text-cn-danger'
              }}
            />
          ))}
        </Layout.Flex>
      )}

      <ControlGroup>
        <FormInput.Checkbox
          id="default-branch"
          {...register!('default')}
          label={t('views:repos.applyRuleDefaultBranch', 'Apply this rule to the default branch')}
        />

        {!!errors?.default && <Message theme={MessageTheme.ERROR}>{errors?.default?.message?.toString()}</Message>}
      </ControlGroup>
    </Layout.Grid>
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
    <Fieldset className="gap-y-cn-md">
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

      <ControlGroup>
        <FormInput.Checkbox
          {...register!('repo_owners')}
          id="edit-permissions"
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
    className?: string
    rule?: Rule
    defaultReviewersOptions?: NormalizedPrincipal[] | null
    principalsSearchQuery?: string
    setPrincipalsSearchQuery?: (val: string) => void
    handleSelectChangeForRule: (ruleId: string, options: MultiSelectOption[]) => void
  }
> = ({
  className,
  defaultReviewersOptions,
  rule,
  setPrincipalsSearchQuery,
  principalsSearchQuery,
  handleSelectChangeForRule
}) => {
  const { t } = useTranslation()
  const { validationMessage, selectOptions } = rule || {}
  const { search: debouncedPrincipalsSearchQuery, handleStringSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setPrincipalsSearchQuery,
    searchValue: principalsSearchQuery || ''
  })

  const multiSelectOptions: MultiSelectOption[] = useMemo(() => {
    return (
      defaultReviewersOptions?.map(option => ({
        id: option.id!,

        key: option.display_name || '',
        icon: getIcon(option.type),
        title: option.email_or_identifier
      })) || []
    )
  }, [defaultReviewersOptions])

  return (
    <ControlGroup className={className}>
      <MultiSelect
        value={selectOptions?.map(option => ({
          id: option.id?.toString() || '',
          icon: option.icon,
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
        inputProps={{
          autoFocus: true
        }}
      />
      {validationMessage && !isEmpty(validationMessage.message) && (
        <Message theme={validationMessage.theme} className="mt-2">
          {validationMessage.theme === MessageTheme.WARNING
            ? t(`views:repos.${validationMessage.message}`)
            : validationMessage.message}
        </Message>
      )}
    </ControlGroup>
  )
}

export const BranchSettingsRuleListField: FC<{
  rules: Rule[]
  recentStatusChecks?: string[] | null
  defaultReviewersOptions?: NormalizedPrincipal[] | null
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
    <Layout.Vertical gapY="xl">
      <Text as="h4" variant="body-strong">
        {t('views:repos.rulesTitle', 'Rules: select all that apply')}
      </Text>

      <Layout.Vertical gapY="lg">
        {branchRules.map((rule, index) => {
          const matchingRule = rules.find(r => r.id === rule.id)
          const {
            checked: isChecked = false,
            disabled: isDisabled = false,
            hidden: isHidden = false
          } = matchingRule || {}

          return (
            !isHidden && (
              <Fragment key={rule.id}>
                {index > 0 && <Separator className={cn('w-auto', rule.isNested && 'ml-[26px]')} />}
                <Checkbox
                  id={rule.id}
                  checked={isChecked}
                  onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
                  disabled={isDisabled}
                  label={rule.label}
                  caption={rule.description}
                  captionVariant="caption-light"
                  className={cn(rule.isNested && 'ml-[26px]')}
                />

                {/* Conditionally render the submenu if this rule has a submenu and is checked */}
                {!!rule?.submenuOptions && !!rule?.submenuOptions.length && isChecked && (
                  <Layout.Vertical className="ml-[26px]" gapY="md">
                    {rule.submenuOptions.map(subOption => (
                      <Checkbox
                        key={`${rule.id}-${subOption.id}`}
                        id={`${rule.id}-${subOption.id}`}
                        checked={rules[index].submenu?.includes(subOption.id as MergeStrategy)}
                        onCheckedChange={checked => handleSubmenuChange(rule.id, subOption.id, checked === true)}
                        label={subOption.label}
                      />
                    ))}
                  </Layout.Vertical>
                )}

                {!!rule?.hasSelect && isChecked && rule.id === BranchRuleId.STATUS_CHECKS && (
                  <MultiSelect
                    wrapperClassName="ml-[26px]"
                    value={rules[index].selectOptions.map(option => ({ id: option?.id, key: option?.key }))}
                    placeholder={t('views:repos.selectStatusesPlaceholder', 'Select status checks')}
                    onChange={options => {
                      handleSelectChangeForRule(rule.id, options)
                    }}
                    options={recentStatusChecks?.map(check => ({ id: check, key: check })) ?? []}
                    disallowCreation
                    inputProps={{
                      autoFocus: true
                    }}
                  />
                )}

                {!!rule?.hasSelect && isChecked && rule.id === BranchRuleId.ENABLE_DEFAULT_REVIEWERS && (
                  <BranchSettingsRuleDefaultReviewersField
                    className="ml-[26px]"
                    defaultReviewersOptions={defaultReviewersOptions}
                    rule={rules[index]}
                    setPrincipalsSearchQuery={setPrincipalsSearchQuery}
                    principalsSearchQuery={principalsSearchQuery}
                    handleSelectChangeForRule={handleSelectChangeForRule}
                  />
                )}

                {!!rule?.hasInput && isChecked && (
                  <NumberInput
                    wrapperClassName={cn('ml-[26px]', { 'ml-[52px]': rule.isNested })}
                    placeholder={
                      rule.id === BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT
                        ? t('views:repos.enterMinDefaultReviewers', 'Enter minimum number of default reviewers')
                        : t('views:repos.enterMinReviewers', 'Enter minimum number of reviewers')
                    }
                    value={rules[index].input || ''}
                    onChange={e => handleInputChange(rule.id, e.target.value)}
                    autoFocus
                  />
                )}
              </Fragment>
            )
          )
        })}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
