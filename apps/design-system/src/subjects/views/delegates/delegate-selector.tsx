import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'
import { defaultTo, noop } from 'lodash-es'

import { Drawer, FormSeparator, StyledLink } from '@harnessio/ui/components'
import { DelegateSelectorForm, DelegateSelectorInput } from '@harnessio/ui/views'

import mockDelegatesList from './mock-delegates-list.json'
import { isDelegateSelected } from './utils'

export const DelegateSelector = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDelegateType, setSelectedDelegateType] = useState(null)

  return (
    <>
      <DelegateSelectorInput
        placeholder={<StyledLink to="#"> select a delegate</StyledLink>}
        value={selectedDelegateType}
        label="Delegate selector"
        onClick={() => {
          setIsDrawerOpen(true)
        }}
        onEdit={() => {
          setIsDrawerOpen(true)
        }}
        onClear={() => setSelectedDelegateType(null)}
        renderValue={delegate => delegate.tags.join(', ')}
        className="max-w-xs mb-8"
      />
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <Drawer.Content className="w-1/2">
          <Drawer.Header>
            <Drawer.Title className="text-cn-foreground-1 mb-2 text-xl">Delegate selector</Drawer.Title>
            <FormSeparator className="w-full" />
            <Drawer.Close onClick={() => setIsDrawerOpen(false)} />
          </Drawer.Header>
          <DelegateSelectorForm
            delegates={mockDelegatesList.map(delegate => ({
              groupId: delegate.groupId,
              groupName: delegate.groupName,
              lastHeartBeat: delegate.lastHeartBeat,
              activelyConnected: delegate.activelyConnected,
              groupCustomSelectors: delegate.groupCustomSelectors || [],
              groupImplicitSelectors: [...Object.keys(defaultTo(delegate.groupImplicitSelectors, {}))]
            }))}
            tagsList={[
              'pzerosanity-windows',
              'eightfivetwoold',
              'qa-automation',
              'pzerosanity',
              'self-hosted-vpc-delegate',
              'local',
              'viaksdcoker',
              'myrunner-ivan',
              'macos-arm64',
              'west1-delegate-qa',
              'linux-amd64',
              'eightfivetwo',
              'automation-eks-delegate'
            ]}
            isDelegateSelected={isDelegateSelected}
            useTranslationStore={useTranslationStore}
            isLoading={false}
            onFormSubmit={noop}
            onBack={() => setIsDrawerOpen(false)}
          />
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
