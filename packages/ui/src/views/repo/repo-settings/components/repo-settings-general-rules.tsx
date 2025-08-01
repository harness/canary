import { FC, useCallback, useMemo } from 'react'
import { Fragment } from 'react/jsx-runtime'

import {
  Alert,
  IconV2,
  ListActions,
  MoreActionsTooltip,
  NoData,
  SearchInput,
  Separator,
  SkeletonList,
  Spacer,
  SplitButton,
  StackedList,
  Tag,
  Text
} from '@/components'
import { Select } from '@/components/form-primitives/select'
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
    <div className="flex items-center gap-1.5 pl-7 text-sm">
      <Text variant="body-normal">
        {targetPatternsCount} {t('views:repos.targetPatterns', 'target patterns')}
      </Text>
      {/* <span className="pointer-events-none mx-1 h-3 w-px bg-cn-background-3" aria-hidden /> */}
      <Separator orientation="vertical" className="h-3" />
      <Text variant="body-normal">
        {rulesAppliedCount} {t('views:repos.rulesApplied', 'rules applied')}
      </Text>
      {/* <span className="pointer-events-none mx-1 h-3 w-px bg-cn-background-3" aria-hidden /> */}
      <Separator orientation="vertical" className="h-3" />
      <span className="flex items-center gap-1">
        {bypassAllowed ? (
          <>
            <IconV2 className="text-icons-success" name="check" size="2xs" />
            <Text variant="body-normal"> {t('views:repos.bypassAllowed', 'bypass allowed')}</Text>
          </>
        ) : (
          <>
            <IconV2 className="text-icons-danger" name="xmark" size="2xs" />
            <Text variant="body-normal">{t('views:repos.bypassNotAllowed', ' bypass not allowed')}</Text>
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
  toRepoBranchRuleCreate?: () => string
  toRepoTagRuleCreate?: () => string
  ruleTypeFilter?: 'branch' | 'tag' | 'push' | null
  setRuleTypeFilter?: (filter: 'branch' | 'tag' | 'push' | null) => void
  toProjectRuleDetails?: (identifier: string, scope: number) => string
}

export const RepoSettingsGeneralRules: FC<RepoSettingsGeneralRulesProps> = ({
  rules,
  apiError,
  handleRuleClick,
  openRulesAlertDeleteDialog,
  isLoading,
  rulesSearchQuery,
  setRulesSearchQuery,
  toRepoBranchRuleCreate,
  toRepoTagRuleCreate,
  ruleTypeFilter,
  setRuleTypeFilter,
  toProjectRuleDetails
}) => {
  const { navigate, Link } = useRouterContext()
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
      {isShowRulesContent ? (
        <>
          <>
            <ListActions.Root className="mt-1">
              <ListActions.Left>
                <SearchInput
                  id="search"
                  defaultValue={rulesSearchQuery}
                  inputContainerClassName="max-w-80"
                  placeholder={t('views:repos.search', 'Search')}
                  onChange={handleSearchChange}
                />
              </ListActions.Left>
              <ListActions.Right>
                <Select
                  options={[
                    { label: t('views:repos.allRules', 'All Rules'), value: null },
                    { label: t('views:repos.branchRules', 'Branch Rules'), value: 'branch' },
                    { label: t('views:repos.tagRules', 'Tag Rules'), value: 'tag' }
                  ]}
                  value={ruleTypeFilter}
                  onChange={value => setRuleTypeFilter?.(value as 'branch' | 'tag' | 'push' | null)}
                  size="md"
                  triggerClassName="min-w-[150px]"
                />
                <SplitButton<string>
                  dropdownContentClassName="mt-0 min-w-[170px]"
                  handleButtonClick={() => navigate(toRepoBranchRuleCreate?.() || '')}
                  handleOptionChange={option => {
                    if (option === 'tag-rule') {
                      navigate(toRepoTagRuleCreate?.() || '')
                    }
                  }}
                  options={[
                    {
                      value: 'tag-rule',
                      label: t('views:repos.newTagRule', 'New tag rule')
                    }
                  ]}
                >
                  {t('views:repos.createBranchRule', 'New branch rule')}
                </SplitButton>
              </ListActions.Right>
            </ListActions.Root>

            <Spacer size={3} />
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
                  <Link
                    to={toProjectRuleDetails?.(rule.identifier, rule.scope ?? 0) || ''}
                    key={rule.identifier}
                    target="_blank"
                  >
                    <StackedList.Item className="cursor-pointer py-4 pr-1.5">
                      <StackedList.Field
                        className="gap-1.5"
                        title={
                          <div className="flex items-center gap-2">
                            {rule.state === 'active' ? (
                              <IconV2 className="text-icons-success" name="check-circle" size="md" />
                            ) : (
                              <IconV2 className="text-icons-9" name="minus-circle" size="md" />
                            )}
                            <span className="text-3 font-medium leading-snug">{rule.identifier}</span>
                            {rule.type && (
                              <Tag
                                showIcon
                                variant="outline"
                                size="sm"
                                theme={rule.type === 'branch' ? 'blue' : 'purple'}
                                value={rule.type === 'branch' ? 'Branch Rule' : 'Tag Rule'}
                                icon={rule.type === 'branch' ? 'git-branch' : 'tag'}
                                rounded={rule.type === 'tag'}
                              />
                            )}
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
                                iconName: 'edit-pencil',
                                onClick: () => handleRuleClick(rule.identifier!)
                              },
                              {
                                isDanger: true,
                                title: t('views:rules.delete', 'Delete rule'),
                                iconName: 'trash',
                                onClick: () => openRulesAlertDeleteDialog(rule.identifier!)
                              }
                            ]}
                          />
                        }
                        right
                        label
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
            <Alert.Root>
              <Alert.Title>{apiError.message}</Alert.Title>
            </Alert.Root>
          )}
        </>
      ) : (
        <NoData
          withBorder
          className="min-h-0 py-cn-3xl"
          textWrapperClassName="max-w-[350px]"
          imageName={'no-data-cog'}
          title={t('views:noData.noRules', 'No rules yet')}
          description={[
            t(
              'views:noData.noRulesDescription',
              'There are no rules in this project. Click on the button below to start adding rules.'
            )
          ]}
          primaryButton={{
            label: t('views:repos.createRuleButton', 'Create rule'),
            to: toRepoBranchRuleCreate?.() ?? ''
          }}
        />
      )}
    </>
  )
}
