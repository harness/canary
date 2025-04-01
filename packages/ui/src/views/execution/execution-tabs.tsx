import { TabNav } from '@/components'
import { SandboxLayout, SubHeaderWrapper, TranslationStore } from '@/views'

export const ExecutionTabs = ({
  useTranslationStore,
  className
}: {
  useTranslationStore: () => TranslationStore
  className?: string
}) => {
  const { t } = useTranslationStore()

  return (
    <SubHeaderWrapper className={className}>
      <SandboxLayout.SubHeader>
        <TabNav.Root>
          <TabNav.Item to="summary">{t('views:execution.summary', 'Summary')}</TabNav.Item>
          <TabNav.Item to="logs">{t('views:execution.logs', 'Logs')}</TabNav.Item>
          <TabNav.Item to="graph">{t('views:execution.graph', 'Graph')}</TabNav.Item>
          <TabNav.Item to="inputs">{t('views:execution.inputs', 'Inputs')}</TabNav.Item>
          <TabNav.Item to="opa">{t('views:execution.opa', 'Policy evaluations')}</TabNav.Item>
          <TabNav.Item to="artifacts">{t('views:execution.artifacts', 'Artifacts')}</TabNav.Item>
          <TabNav.Item to="tests">{t('views:execution.tests', 'Tests')}</TabNav.Item>
          <TabNav.Item to="sto">{t('views:execution.sto', 'Security tests')}</TabNav.Item>
          <TabNav.Item to="secrets">{t('views:execution.secrets', 'Secrets')}</TabNav.Item>
        </TabNav.Root>
      </SandboxLayout.SubHeader>
    </SubHeaderWrapper>
  )
}
