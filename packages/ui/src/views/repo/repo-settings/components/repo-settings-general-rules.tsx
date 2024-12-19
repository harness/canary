import { NavLink } from 'react-router-dom'

import { Button, Icon, ListActions, NoData, SearchBox, Spacer, StackedList, Text } from '@/components'
import { TranslationStore } from '@views/repo/repo-list/types'
import { TFunction } from 'i18next'

import { ErrorTypes, RuleDataType } from '../types'
import { RepoSettingsToolTip } from './repo-settings-general-tooltip'

const Title = ({ title, iconName }: { title?: string; iconName: 'green-tick' | 'cancel-grey' }) => {
  return (
    <div className="flex items-center gap-2">
      {<Icon name={iconName} />}
      <Text truncate>{title}</Text>
    </div>
  )
}

const Description = ({
  targetPatternsCount,
  rulesAppliedCount,
  bypassAllowed,
  t
}: {
  targetPatternsCount: number
  rulesAppliedCount: number
  bypassAllowed: boolean
  t: TFunction
}) => {
  return (
    <Text color="tertiaryBackground" as="div" className="flex items-center gap-1 pl-[24px]">
      {targetPatternsCount} {t('views:repos.targetPatterns', 'target patterns')}
      <span className="pointer-events-none mx-1 h-3 w-px bg-borders-2" aria-hidden />
      {rulesAppliedCount} {t('views:repos.rulesApplied', 'rules applied')}
      <span className="pointer-events-none mx-1 h-3 w-px bg-borders-2" aria-hidden />
      {bypassAllowed ? (
        <div>
          <Icon name="tick" className="inline text-success" size={12} />
          <span> {t('views:repos.bypassAllowed', 'bypass allowed')}</span>
        </div>
      ) : (
        <div>
          <Icon name="x-mark" className="inline text-destructive" size={12} />
          <span>{t('views:repos.bypassNotAllowed', ' bypass not allowed')}</span>
        </div>
      )}
    </Text>
  )
}

export const RepoSettingsGeneralRules = ({
  rules,
  apiError,
  handleRuleClick,
  openRulesAlertDeleteDialog,
  useTranslationStore
}: {
  rules: RuleDataType[] | null
  apiError: { type: ErrorTypes; message: string } | null
  handleRuleClick: (identifier: string) => void
  openRulesAlertDeleteDialog: (identifier: string) => void
  useTranslationStore: () => TranslationStore
}) => {
  const { t } = useTranslationStore()
  return (
    <>
      {rules && rules.length > 0 ? (
        <>
          <Text size={4} weight="medium">
            {t('views:repos.rules', 'Rules')}
          </Text>
          <Spacer size={6} />

          <ListActions.Root>
            <ListActions.Left>
              <SearchBox.Root placeholder={t('views:repos.search', 'Search')} width="full" />
            </ListActions.Left>
            <ListActions.Right>
              <NavLink to="../rules/create">
                <Button variant="outline">{t('views:repos.newRule', 'New branch rule')}</Button>
              </NavLink>
            </ListActions.Right>
          </ListActions.Root>

          <Spacer size={6} />

          <StackedList.Root>
            {rules.map(rule => (
              <StackedList.Item key={rule.identifier} onClick={() => handleRuleClick(rule.identifier ?? '')}>
                <StackedList.Field
                  title={
                    <Title title={rule.identifier} iconName={rule.state === 'active' ? 'green-tick' : 'cancel-grey'} />
                  }
                  description={
                    <Description
                      targetPatternsCount={rule.targetPatternsCount ?? 0}
                      rulesAppliedCount={rule.rulesAppliedCount ?? 0}
                      bypassAllowed={rule.bypassAllowed ?? false}
                      t={t}
                    />
                  }
                  className="gap-0"
                />
                <StackedList.Field
                  label
                  secondary
                  title={
                    <RepoSettingsToolTip
                      onEdit={handleRuleClick}
                      onDelete={openRulesAlertDeleteDialog}
                      identifier={rule.identifier ?? ''}
                    />
                  }
                  right
                />
              </StackedList.Item>
            ))}

            {apiError && (apiError.type === ErrorTypes.FETCH_RULES || apiError.type === ErrorTypes.DELETE_RULE) && (
              <>
                <Spacer size={2} />
                <Text size={1} className="text-destructive">
                  {apiError.message}
                </Text>
              </>
            )}
          </StackedList.Root>
        </>
      ) : (
        <NoData
          iconName="no-data-folder"
          title={t('views:repos.noRulesTitle', 'No rules yet')}
          description={[t('views:repos.noRulesDescription', 'There are no rules in this repository yet.')]}
          primaryButton={{ label: t('views:repos.createRuleDescription', 'Create rule'), to: '../rules/create' }}
        />
      )}
    </>
  )
}
