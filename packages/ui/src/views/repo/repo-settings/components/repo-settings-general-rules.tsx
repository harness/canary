import { FC, MouseEvent, useCallback, useMemo } from 'react'
import { Fragment } from 'react/jsx-runtime'

import {
  Alert,
  IconV2,
  Layout,
  ListActions,
  MoreActionsTooltip,
  NoData,
  ScopeTag,
  SearchInput,
  Separator,
  Skeleton,
  SplitButton,
  StackedList,
  Tag,
  Text
} from '@/components'
import { Select } from '@/components/form-primitives/select'
import { useRouterContext, useTranslation } from '@/context'
import { ErrorTypes, RuleDataType, ScopeType } from '@/views'

// Utility function to map numeric scope to ScopeType enum
const getScopeType = (scope: number): ScopeType => {
  switch (scope) {
    case 0:
      return ScopeType.Repository
    case 3:
      return ScopeType.Project
    case 2:
      return ScopeType.Organization
    default:
      return ScopeType.Account
  }
}

interface DescriptionProps {
  targetPatternsCount: number
  rulesAppliedCount: number
  bypassAllowed: boolean
}

const Description: FC<DescriptionProps> = ({ targetPatternsCount, rulesAppliedCount, bypassAllowed }) => {
  const { t } = useTranslation()
  return (
    <Layout.Grid flow="column" gapX="xs" align="center" className="w-fit pl-7">
      {targetPatternsCount !== 0 && (
        <>
          <Text truncate>
            {targetPatternsCount} {t('views:repos.targetPatterns', 'target patterns')}
          </Text>
          <Separator orientation="vertical" className="h-3" />
        </>
      )}
      <Text truncate>
        {rulesAppliedCount} {t('views:repos.rulesApplied', 'rules applied')}
      </Text>
      <Separator orientation="vertical" className="h-3" />
      <Layout.Flex align="center" gapX="3xs">
        {bypassAllowed ? (
          <>
            <IconV2 className="text-icons-success" name="check" size="xs" />
            <Text truncate>{t('views:repos.bypassAllowed', 'bypass allowed')}</Text>
          </>
        ) : (
          <>
            <IconV2 className="text-icons-danger" name="warning-triangle" size="xs" />
            <Text truncate>{t('views:repos.bypassNotAllowed', 'bypass not allowed')}</Text>
          </>
        )}
      </Layout.Flex>
    </Layout.Grid>
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
  toProjectRuleDetails?: (identifier: string, scope: number) => void
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
  const { navigate } = useRouterContext()
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

  const handleToProjectRuleDetails = (e: MouseEvent<HTMLAnchorElement>, rule: RuleDataType) => {
    e.preventDefault()
    e.stopPropagation()
    toProjectRuleDetails?.(rule.identifier ?? '', rule.scope ?? 0)
  }

  if (!isShowRulesContent) {
    return (
      <NoData
        withBorder
        textWrapperClassName="max-w-[350px]"
        imageName="no-data-cog"
        title={t('views:noData.noRules', 'No rules yet')}
        description={[
          t(
            'views:noData.noRulesDescription',
            'There are no rules in this project. Click on the button below to start adding rules.'
          )
        ]}
        splitButton={{
          icon: 'plus',
          label: t('views:repos.createBranchRuleButton', 'Create Branch Rule'),
          options: [{ value: 'tag-rule', label: t('views:repos.createTagRuleButton', 'Create Tag Rule') }],
          handleOptionChange: option => {
            if (option === 'tag-rule') {
              navigate(toRepoTagRuleCreate?.() || '')
            }
          },
          handleButtonClick: () => navigate(toRepoBranchRuleCreate?.() || '')
        }}
      />
    )
  }

  return (
    <Layout.Vertical gapY="sm" grow>
      <ListActions.Root>
        <ListActions.Left>
          <SearchInput
            id="search"
            defaultValue={rulesSearchQuery}
            inputContainerClassName="w-80"
            placeholder={t('views:repos.search', 'Search')}
            onChange={handleSearchChange}
          />
        </ListActions.Left>
        <ListActions.Right className="gap-x-cn-sm">
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
                label: t('views:repos.createTagRuleButton', 'Create Tag Rule')
              }
            ]}
          >
            <IconV2 name="plus" />
            {t('views:repos.createBranchRuleButton', 'Create Branch Rule')}
          </SplitButton>
        </ListActions.Right>
      </ListActions.Root>

      {isLoading && <Skeleton.List />}

      {!isLoading && rules?.length !== 0 && (
        <StackedList.Root>
          {rules?.map((rule, idx) => {
            if (!rule?.identifier) return <Fragment key={idx} />

            return (
              <StackedList.Item
                className="p-cn-md pr-cn-xs gap-x-cn-md last:border-b-0"
                linkProps={{ onClick: e => handleToProjectRuleDetails(e, rule) }}
                key={rule.identifier}
              >
                <StackedList.Field
                  className="gap-cn-xs grid"
                  title={
                    <Layout.Grid flow="column" gapX="xs" align="center" className="w-fit">
                      {rule.state === 'active' ? (
                        <IconV2 className="text-icons-success" name="check-circle" size="md" />
                      ) : (
                        <IconV2 className="text-icons-9" name="prohibition" size="md" />
                      )}
                      <Text variant="heading-base" truncate>
                        {rule.identifier}
                      </Text>
                      {rule.type && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <Tag
                            variant="outline"
                            size="sm"
                            theme={rule.type === 'branch' ? 'blue' : 'purple'}
                            value={rule.type === 'branch' ? 'Branch Rule' : 'Tag Rule'}
                            icon={rule.type === 'branch' ? 'git-branch' : 'tag'}
                            rounded={rule.type === 'tag'}
                          />
                        </>
                      )}
                      <Separator orientation="vertical" className="h-3" />
                      <ScopeTag
                        scopeType={getScopeType(rule.scope ?? 0)}
                        scopedPath={getScopeType(rule.scope ?? 0)}
                        size="sm"
                      />
                    </Layout.Grid>
                  }
                  description={
                    <Description
                      targetPatternsCount={rule.targetPatternsCount ?? 0}
                      rulesAppliedCount={rule.rulesAppliedCount ?? 0}
                      bypassAllowed={rule.bypassAllowed ?? false}
                    />
                  }
                />
                <MoreActionsTooltip
                  actions={[
                    {
                      title: t('views:rules.edit', 'Edit Rule'),
                      iconName: 'edit-pencil',
                      onClick: () => handleRuleClick(rule.identifier!)
                    },
                    {
                      isDanger: true,
                      title: t('views:rules.delete', 'Delete Rule'),
                      iconName: 'trash',
                      onClick: () => openRulesAlertDeleteDialog(rule.identifier!)
                    }
                  ]}
                />
              </StackedList.Item>
            )
          })}
        </StackedList.Root>
      )}

      {!isLoading && rules?.length === 0 && (
        <NoData
          withBorder
          textWrapperClassName="max-w-[312px]"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t(
              'views:noData.noResultsDescription',
              'No rules match your search. Try adjusting your keywords or filters.',
              { type: 'rules' }
            )
          ]}
          secondaryButton={{
            icon: 'trash',
            label: t('views:noData.clearSearch', 'Clear search'),
            onClick: resetSearch
          }}
        />
      )}

      {apiError && apiError.type === ErrorTypes.FETCH_RULES && (
        <Alert.Root>
          <Alert.Title>{apiError.message}</Alert.Title>
        </Alert.Root>
      )}
    </Layout.Vertical>
  )
}
