import { FC, useMemo, useState } from 'react'

import {
  Button,
  Checkbox,
  ControlGroup,
  Fieldset,
  FormInput,
  IconV2,
  Label,
  MultiSelectOption,
  SplitButton,
  Switch
} from '@/components'
import { useTranslation } from '@/context'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { EnumBypassListType, NormalizedPrincipal, PatternsButtonType } from '@views/repo/repo-branch-rules/types'
import { getIcon } from '@views/repo/repo-branch-rules/utils'

import { TagFieldProps, TagRule } from '../types'
import { getTagRules } from './repo-tag-rules-data'

export const TagSettingsRuleToggleField: FC<TagFieldProps> = ({ register, watch, setValue }) => {
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

export const TagSettingsRuleNameField: FC<TagFieldProps & { disabled: boolean }> = ({ register, disabled }) => {
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

export const TagSettingsRuleDescriptionField: FC<TagFieldProps> = ({ register }) => {
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

export const TagSettingsRuleTargetPatternsField: FC<TagFieldProps> = ({ setValue, watch, register }) => {
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
              'Match tags using globstar patterns (e.g.”golden”, “feature-*”, “releases/**”)'
            )}
            placeholder={t('views:repos.rulePatternPlaceholder', 'Enter the target patterns')}
          />
          <SplitButton<PatternsButtonType>
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
    </Fieldset>
  )
}

export const TagSettingsRuleBypassListField: FC<
  TagFieldProps & {
    bypassOptions: NormalizedPrincipal[] | null
    setPrincipalsSearchQuery: (val: string) => void
    principalsSearchQuery: string
    register: any
    bypassListPlaceholder?: string
  }
> = ({ bypassOptions, errors, setPrincipalsSearchQuery, principalsSearchQuery, register, bypassListPlaceholder }) => {
  const { t } = useTranslation()
  const { search: debouncedPrincipalsSearchQuery, handleStringSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setPrincipalsSearchQuery,
    searchValue: principalsSearchQuery || ''
  })

  const multiSelectOptions: MultiSelectOption[] = useMemo(() => {
    return (
      bypassOptions?.map(option => ({
        id: option.id!,

        key: option.display_name,
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
          id="edit-permissions"
          label={t(
            'views:repos.editPermissionsCheckboxDescription',
            'Allow users with edit permission on the repository to bypass'
          )}
        />
      </ControlGroup>
    </Fieldset>
  )
}

export const TagSettingsRuleListField: FC<{
  rules: TagRule[]
  handleCheckboxChange: (ruleId: string, checked: boolean) => void
}> = ({ rules, handleCheckboxChange }) => {
  const { t } = useTranslation()
  const tagRules = getTagRules(t)

  return (
    <ControlGroup>
      <Label className="mb-4">{t('views:repos.rulesTitle', 'Rules: select all that apply')}</Label>
      <Fieldset className="gap-y-4">
        {tagRules.map(rule => {
          const matchingRule = rules.find(r => r.id === rule.id)
          const { checked: isChecked = false, disabled: isDisabled = false } = matchingRule || {}

          return (
            <Fieldset key={rule.id} className="gap-y-4">
              <Checkbox
                id={rule.id}
                checked={isChecked}
                onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
                disabled={isDisabled}
                label={rule.label}
                caption={rule.description}
              />
            </Fieldset>
          )
        })}
      </Fieldset>
    </ControlGroup>
  )
}
