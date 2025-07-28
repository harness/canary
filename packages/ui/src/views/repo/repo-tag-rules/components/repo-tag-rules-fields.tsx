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
  StackedList,
  Switch
} from '@/components'
import { useTranslation } from '@/context'
import { PrincipalType } from '@/types'
import { cn } from '@utils/cn'
import { PatternsButtonType } from '@views/repo/repo-branch-rules/types'

import { TagFieldProps, TagRule } from '../types'
import { getTagRules } from './repo-tag-rules-data'

export const TagSettingsRuleToggleField: FC<TagFieldProps> = ({ register, watch, setValue }) => {
  const { t } = useTranslation()
  return (
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
        <Label htmlFor="target-patterns" className="mb-2">
          {t('views:repos.targetPatterns', 'Target patterns')}
        </Label>
        <div className="grid grid-cols-[1fr_112px] items-start gap-x-3.5">
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
            buttonClassName="px-0 w-full"
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
    bypassOptions: PrincipalType[] | null
    setPrincipalsSearchQuery: (val: string) => void
    principalsSearchQuery: string
    register: any
  }
> = ({ bypassOptions, errors, setPrincipalsSearchQuery, principalsSearchQuery, register }) => {
  const { t } = useTranslation()

  const multiSelectOptions: MultiSelectOption[] = useMemo(() => {
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
    <ControlGroup className="max-w-[476px]">
      <Label className="mb-6">{t('views:repos.rulesTitle', 'Rules: select all that apply')}</Label>
      <Fieldset className="gap-y-5">
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
