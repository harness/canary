import { FC, Fragment, useMemo } from 'react'

import {
  Checkbox,
  ControlGroup,
  Fieldset,
  FormInput,
  Label,
  Layout,
  MultiSelectOption,
  NumberInput,
  Switch
} from '@/components'
import { Separator } from '@/components/separator'
import { useTranslation } from '@/context'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { EnumBypassListType, NormalizedPrincipal } from '@views/repo/repo-branch-rules/types'
import { getIcon } from '@views/repo/utils'

import { PushRule, PushRuleFieldProps, PushRuleId } from '../types'
import { getPushRules } from './repo-push-rules-data'

export const PushSettingsRuleToggleField: FC<PushRuleFieldProps> = ({ register, watch, setValue }) => {
  const { t } = useTranslation()
  return (
    <Switch
      {...register!('state')}
      checked={watch!('state')}
      onCheckedChange={() => setValue!('state', !watch!('state'))}
      label={t('views:repos.enableRule', 'Enable the rule')}
      caption={t('views:repos.enableRuleDescription', 'By enabling the toggle, the {type} rule will be enforced.', {
        type: 'push'
      })}
    />
  )
}

export const PushSettingsRuleNameField: FC<PushRuleFieldProps & { disabled: boolean }> = ({ register, disabled }) => {
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

export const PushSettingsRuleDescriptionField: FC<PushRuleFieldProps> = ({ register }) => {
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

export const PushSettingsRuleBypassListField: FC<
  PushRuleFieldProps & {
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
      </ControlGroup>
    </Fieldset>
  )
}

export const PushSettingsRuleListField: FC<{
  rules: PushRule[]
  handleCheckboxChange: (ruleId: string, checked: boolean) => void
  handleInputChange: (ruleId: string, value: string) => void
}> = ({ rules, handleCheckboxChange, handleInputChange }) => {
  const { t } = useTranslation()
  const pushRules = getPushRules(t)
  return (
    <Layout.Vertical gapY="xl">
      <Label>{t('views:repos.rulesTitle', 'Rules: select all that apply')}</Label>
      <Layout.Vertical gapY="lg">
        {pushRules.map((rule, index) => {
          const matchingRule = rules.find(r => r.id === rule.id)
          const {
            checked: isChecked = false,
            disabled: isDisabled = false,
            input: inputValue = ''
          } = matchingRule || {}

          return (
            <Fragment key={rule.id}>
              {index > 0 && <Separator />}
              <Checkbox
                id={rule.id}
                checked={isChecked}
                onCheckedChange={checked => handleCheckboxChange(rule.id, checked === true)}
                disabled={isDisabled}
                label={rule.label}
                caption={rule.description}
                captionVariant="caption-light"
              />
              {!!rule?.hasInput && isChecked && (
                <NumberInput
                  wrapperClassName="ml-[26px]"
                  placeholder={
                    rule.id === PushRuleId.FILE_SIZE_LIMIT
                      ? t('views:repos.enterFileSizeLimit', 'Enter file size limit ( in bytes )')
                      : ''
                  }
                  value={inputValue || ''}
                  onChange={e => handleInputChange(rule.id, e.target.value)}
                  autoFocus
                />
              )}
            </Fragment>
          )
        })}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
