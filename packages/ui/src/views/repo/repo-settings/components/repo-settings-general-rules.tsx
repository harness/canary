import { FC, useCallback, useMemo } from 'react'
import { Fragment } from 'react/jsx-runtime'

import {
  Button,
  IconV2,
  ListActions,
  MoreActionsTooltip,
  NoData,
  SearchInput,
  SkeletonList,
  Spacer,
  StackedList,
  Text
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { ErrorTypes, RuleDataType } from '@/views'

interface DescriptionProps {
  targetPatternsCount: number
  rulesAppliedCount: number
  bypassAllowed: boolean
}

const Description: FC<DescriptionProps> = ({ targetPatternsCount, rulesAppliedCount, bypassAllowed }) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-1.5 pl-6 text-sm">
      {targetPatternsCount} {t('views:repos.targetPatterns', 'target patterns')}
      <span className="pointer-events-none mx-1 h-3 w-px bg-cn-background-3" aria-hidden />
      {rulesAppliedCount} {t('views:repos.rulesApplied', 'rules applied')}
      <span className="pointer-events-none mx-1 h-3 w-px bg-cn-background-3" aria-hidden />
      <span className="flex items-center gap-1">
        {bypassAllowed ? (
          <>
            <IconV2 className="text-icons-success" name="check" size="2xs" />
            <span> {t('views:repos.bypassAllowed', 'bypass allowed')}</span>
          </>
        ) : (
          <>
            <IconV2 className="text-icons-danger" name="xmark" size="2xs" />
            <span>{t('views:repos.bypassNotAllowed', ' bypass not allowed')}</span>
          </>
        )}
      </span>
    </div>
  )
}

export interface RepoSettingsGeneralRulesProps {
  rules: RuleDataType[] | null
  apiError: { type: ErrorTypes; message: string } | null
  handleRuleClick: (identifier: string) => void
  openRulesAlertDeleteDialog: (identifier: string) => void
  isLoading: boolean
  rulesSearchQuery?: string
  setRulesSearchQuery?: (query: string) => void
  projectScope?: boolean
}

export const RepoSettingsGeneralRules: FC<RepoSettingsGeneralRulesProps> = ({
  rules,
  apiError,
  handleRuleClick,
  openRulesAlertDeleteDialog,
  isLoading,
  rulesSearchQuery,
  setRulesSearchQuery,
  projectScope = false
}) => {
  const { Link, NavLink } = useRouterContext()
  const { t } = useTranslation()

  const handleSearchChange = useCallback(
    (val: string) => {
      setRulesSearchQuery?.(val)
    },
    [setRulesSearchQuery]
  )

  const resetSearch = () => {
    setRulesSearchQuery?.('')
  }

  const isShowRulesContent = useMemo(() => {
    return !!rules?.length || !!rulesSearchQuery?.length
  }, [rulesSearchQuery, rules])

  return (
    <>
      {!projectScope ? (
        <>
          <Text className="mb-2.5">{t('views:repos.rules', 'Rules')}</Text>

          <div className="flex flex-row">
            <span className="max-w-[440px]">
              {t(
                'views:repos.rulesDescription',
                'Define standards and automate workflows to ensure better collaboration and control in your repository.'
              )}
            </span>
            {!isLoading && !isShowRulesContent && (
              <NavLink className="ml-auto" to="../rules/create">
                <Button variant="outline">{t('views:repos.createRuleButton', 'Create rule')}</Button>
              </NavLink>
            )}
          </div>
        </>
      ) : null}
      {isShowRulesContent && (
        <>
          <Spacer size={7} />
          <>
            <ListActions.Root>
              <ListActions.Left>
                <SearchInput
                  id="search"
                  size="sm"
                  defaultValue={rulesSearchQuery}
                  inputContainerClassName={projectScope ? 'max-w-96' : 'max-w-xs'}
                  placeholder={t('views:repos.search', 'Search')}
                  onChange={handleSearchChange}
                />
              </ListActions.Left>
              <ListActions.Right>
                <NavLink to="../rules/create">
                  <Button variant={projectScope ? 'primary' : 'outline'}>
                    {t('views:repos.newRule', 'New branch rule')}
                  </Button>
                </NavLink>
              </ListActions.Right>
            </ListActions.Root>

            <Spacer size={4.5} />
          </>
          {isLoading ? (
            <>
              <Spacer size={7} />
              <SkeletonList />
            </>
          ) : rules?.length !== 0 ? (
            <StackedList.Root>
              {rules?.map((rule, idx) =>
                rule?.identifier ? (
                  <Link to={`../rules/${rule.identifier}`} key={rule.identifier}>
                    <StackedList.Item key={rule.identifier} className="cursor-pointer py-3 pr-1.5">
                      <StackedList.Field
                        className="gap-1.5"
                        title={
                          <div className="flex items-center gap-2">
                            {rule.state === 'active' ? (
                              <IconV2 className="text-icons-success" name="check-circle" />
                            ) : (
                              <IconV2 className="text-icons-9" name="minus-circle" />
                            )}
                            <span className="text-3 font-medium leading-snug">{rule.identifier}</span>
                          </div>
                        }
                        description={
                          <Description
                            targetPatternsCount={rule.targetPatternsCount ?? 0}
                            rulesAppliedCount={rule.rulesAppliedCount ?? 0}
                            bypassAllowed={rule.bypassAllowed ?? false}
                          />
                        }
                      />
                      <StackedList.Field
                        title={
                          <MoreActionsTooltip
                            actions={[
                              {
                                title: t('views:rules.edit', 'Edit rule'),
                                onClick: () => handleRuleClick(rule.identifier!)
                              },
                              {
                                isDanger: true,
                                title: t('views:rules.delete', 'Delete rule'),
                                onClick: () => openRulesAlertDeleteDialog(rule.identifier!)
                              }
                            ]}
                          />
                        }
                        right
                        label
                        secondary
                      />
                    </StackedList.Item>
                  </Link>
                ) : (
                  <Fragment key={idx} />
                )
              )}
            </StackedList.Root>
          ) : (
            <NoData
              className="min-h-0 py-10"
              withBorder
              textWrapperClassName="max-w-[312px]"
              title={t('views:noData.noResults', 'No search results')}
              description={[
                t(
                  'views:noData.noResultsDescription',
                  'No rules match your search. Try adjusting your keywords or filters.',
                  {
                    type: 'rules'
                  }
                )
              ]}
              primaryButton={{
                label: t('views:noData.clearSearch', 'Clear search'),
                onClick: resetSearch
              }}
            />
          )}
          {apiError && (apiError.type === ErrorTypes.FETCH_RULES || apiError.type === ErrorTypes.DELETE_RULE) && (
            <>
              <Spacer size={2} />
              <Text color="danger">{apiError.message}</Text>
            </>
          )}
        </>
      )}
    </>
  )
}
