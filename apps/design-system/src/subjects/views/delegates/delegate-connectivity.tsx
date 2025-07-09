import { defaultTo } from 'lodash-es'

import { DelegateConnectivityList, SandboxLayout } from '@harnessio/ui/views'

import mockDelegatesList from './mock-delegates-list.json'
import { isDelegateSelected } from './utils'

const DelegateConnectivityWrapper = (): JSX.Element => (
  <SandboxLayout.Main>
    <SandboxLayout.Content>
      <DelegateConnectivityList
        delegates={mockDelegatesList.map(delegate => ({
          groupId: delegate.groupId,
          groupName: delegate.groupName,
          lastHeartBeat: delegate.lastHeartBeat,
          activelyConnected: delegate.activelyConnected,
          groupCustomSelectors: delegate.groupCustomSelectors || [],
          groupImplicitSelectors: [...Object.keys(defaultTo(delegate.groupImplicitSelectors, {}))]
        }))}
        isLoading={false}
        selectedTags={[]}
        isDelegateSelected={isDelegateSelected}
      />
    </SandboxLayout.Content>
  </SandboxLayout.Main>
)

export { DelegateConnectivityWrapper }
