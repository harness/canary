import { Tabs } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { SandboxLayout, SubHeaderWrapper } from '@views'

export const ExecutionTabs = ({ className }: { className?: string }) => {
  const { t } = useTranslation()

  return (
    <SubHeaderWrapper className={className}>
      <SandboxLayout.SubHeader>
        <Tabs.NavRoot>
          <Tabs.List className="px-cn-xl">
            <Tabs.Trigger value="summary">{t('views:execution.summary', 'Summary')}</Tabs.Trigger>
            <Tabs.Trigger value="logs">{t('views:execution.logs', 'Logs')}</Tabs.Trigger>
            <Tabs.Trigger value="graph">{t('views:execution.graph', 'Graph')}</Tabs.Trigger>
            <Tabs.Trigger value="inputs">{t('views:execution.inputs', 'Inputs')}</Tabs.Trigger>
            <Tabs.Trigger value="opa">{t('views:execution.opa', 'Policy evaluations')}</Tabs.Trigger>
            <Tabs.Trigger value="artifacts">{t('views:execution.artifacts', 'Artifacts')}</Tabs.Trigger>
            <Tabs.Trigger value="tests">{t('views:execution.tests', 'Tests')}</Tabs.Trigger>
            <Tabs.Trigger value="sto">{t('views:execution.sto', 'Security tests')}</Tabs.Trigger>
            <Tabs.Trigger value="secrets">{t('views:execution.secrets', 'Secrets')}</Tabs.Trigger>
          </Tabs.List>
        </Tabs.NavRoot>
      </SandboxLayout.SubHeader>
    </SubHeaderWrapper>
  )
}
