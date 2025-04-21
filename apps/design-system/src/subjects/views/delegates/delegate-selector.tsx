import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'
import { defaultTo } from 'lodash-es'

import { Drawer, FormSeparator, Icon, StyledLink } from '@harnessio/ui/components'
import {
  DelegateSelectorForm,
  DelegateSelectorFormFields,
  DelegateSelectorInput,
  DelegateTypes
} from '@harnessio/ui/views'

import mockDelegatesList from './mock-delegates-list.json'
import { getMatchedDelegatesCount, isDelegateSelected } from './utils'

export const DelegateSelector = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string>('')

  const onSubmit = (data: DelegateSelectorFormFields) => {
    if (data.type === DelegateTypes.ANY) {
      setSelectedTags('any')
    } else {
      setSelectedTags(data.tags.map(tag => tag.id).join(', '))
    }
    setIsDrawerOpen(false)
  }

  return (
    <>
      <DelegateSelectorInput
        placeholder={<StyledLink to="#"> select a delegate</StyledLink>}
        value={selectedTags}
        label="Delegate selector"
        onClick={() => {
          setIsDrawerOpen(true)
        }}
        onEdit={() => {
          setIsDrawerOpen(true)
        }}
        onClear={() => setSelectedTags('')}
        renderValue={(tag: string) => tag}
        className="max-w-xs mb-8"
      />
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <Drawer.Content className="w-1/2">
          <Drawer.Header>
            <Drawer.Title className="text-cn-foreground-1 mb-2 text-xl">Delegate selector</Drawer.Title>
            <FormSeparator className="w-full" />
            <div className="flex">
              Haven't installed a delegate yet?
              <StyledLink className="flex flex-row items-center ml-1" variant="accent" to="#">
                Install delegate<Icon name="attachment-link" className="ml-1" size={12}></Icon>
              </StyledLink>
            </div>
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
            useTranslationStore={useTranslationStore}
            isLoading={false}
            onFormSubmit={onSubmit}
            onBack={() => setIsDrawerOpen(false)}
            isDelegateSelected={isDelegateSelected}
            getMatchedDelegatesCount={getMatchedDelegatesCount}
          />
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
