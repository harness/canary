import { FC, useMemo } from 'react'

import { NoData } from '@/components'
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

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

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
            label: t('views:projectSettings.addRule', 'Add new rule'),
            to: 'create'
          }}
        />
      ) : (
        <SandboxLayout.Main>
          <SandboxLayout.Content maxWidth="3xl">
            {/* <h1 className="mb-6 text-2xl font-medium text-foreground-1">{t('views:projectSettings.rules', 'Rules')}</h1> */}
            <h1 className="mb-6 text-2xl font-medium text-foreground-1">Rules</h1>

            <RepoSettingsGeneralRules
              rules={rulesData}
              isLoading={isLoading}
              apiError={null}
              handleRuleClick={() => {}}
              openRulesAlertDeleteDialog={() => {}}
              useTranslationStore={useTranslationStore}
              rulesSearchQuery={searchQuery}
              setRulesSearchQuery={setSearchQuery}
              projectScope
            />
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      )}
    </>
  )
}
