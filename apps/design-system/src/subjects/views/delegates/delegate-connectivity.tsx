import { useTranslationStore } from '@utils/viewUtils'

import { DelegateConnectivityList, SandboxLayout } from '@harnessio/ui/views'

import mockDelegatesList from './mock-delegates-list.json'

const DelegateConnectivityWrapper = (): JSX.Element => (
  <SandboxLayout.Main>
    <SandboxLayout.Content>
      <DelegateConnectivityList
        delegates={mockDelegatesList.map(delegate => ({
          groupId: delegate.groupId,
          groupName: delegate.groupName,
          lastHeartBeat: delegate.lastHeartBeat,
          activelyConnected: delegate.activelyConnected,
          groupCustomSelectors: delegate.groupCustomSelectors || []
        }))}
        useTranslationStore={useTranslationStore}
        isLoading={false}
        selectedTags={[]}
      />
    </SandboxLayout.Content>
  </SandboxLayout.Main>
)

export { DelegateConnectivityWrapper }
