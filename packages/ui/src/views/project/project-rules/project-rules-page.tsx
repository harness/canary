import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, NoData, SearchBox, Spacer } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { RuleDataType, SandboxLayout, TranslationStore } from '@/views'
import { RepoSettingsGeneralRules } from '@views/repo/repo-settings/components/repo-settings-general-rules'

export interface ProjectRulesPageProps {
  rulesData: RuleDataType[] | null
  isLoading: boolean
  useTranslationStore: () => TranslationStore
  searchQuery: string
  setSearchQuery: (query: string) => void
  page: number
  setPage: (page: number) => void
}
export const ProjectRulesPage: FC<ProjectRulesPageProps> = ({
  rulesData,
  isLoading,
  useTranslationStore,
  searchQuery,
  setSearchQuery,
  page,
  setPage
}) => {
  const { t } = useTranslationStore()

  const { search, handleSearchChange, handleResetSearch } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery || ''
  })

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetFiltersQueryAndPages = () => {
    handleResetSearch()
    setPage(1)
  }

  console.log(rulesData)

  return (
    <>
      {!rulesData?.length && !isDirtyList && !isLoading ? (
        <NoData
          textWrapperClassName="max-w-[350px]"
          iconName="no-data-members"
          title={t('views:noData.rules', 'No rules yet')}
          description={[
            t(
              'views:noData.noRules',
              'There are no rules in this project. Click on the button below to start adding rules.'
            )
          ]}
          primaryButton={{
            label: t('views:projectSettings.', 'Add new rule'),
            onClick: () => {
              //   setIsInviteMemberDialogOpen(true)
            }
          }}
        />
      ) : (
        <SandboxLayout.Main>
          <SandboxLayout.Content maxWidth="3xl">
            {/* <h1 className="mb-6 text-2xl font-medium text-foreground-1">{t('views:projectSettings.rules', 'Rules')}</h1> */}
            <h1 className="mb-6 text-2xl font-medium text-foreground-1">Rules</h1>

            {((rulesData && !!rulesData.length) || (rulesData && !rulesData.length && isDirtyList)) && (
              <>
                <ListActions.Root>
                  <ListActions.Left>
                    <SearchBox.Root
                      width="full"
                      className="max-w-96"
                      autoFocus
                      value={search}
                      handleChange={handleSearchChange}
                      placeholder={t('views:repos.search', 'Search')}
                    />
                  </ListActions.Left>
                  <ListActions.Right>
                    <Link to="create">
                      <Button variant="default">{t('views:projectSettings.newBranchRule', 'New branch rule')}</Button>
                    </Link>
                  </ListActions.Right>
                </ListActions.Root>

                <Spacer size={4.5} />
              </>
            )}
            <RepoSettingsGeneralRules
              rules={rulesData}
              isLoading={isLoading}
              apiError={null}
              handleRuleClick={() => {}}
              openRulesAlertDeleteDialog={() => {}}
              useTranslationStore={useTranslationStore}
              rulesSearchQuery={searchQuery}
              projectScope
            />
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      )}
    </>
  )
}
