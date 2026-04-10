import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import {
  ConnectorFilterProperties,
  ConnectorResponse,
  SortOrder,
  useGetConnectorListV2Mutation
} from '@harnessio/react-ng-manager-v2-client'
import {
  Button,
  Drawer,
  IconV2,
  Layout,
  LogoV2,
  SearchInput,
  Skeleton,
  Table,
  Tabs,
  Text
} from '@harnessio/ui/components'

import { useMFEContext } from '../framework/hooks/useMFEContext'
import { StoreType, StoreTypeSelect } from './store-type-select'

enum Scope {
  Account = 'account',
  Organization = 'org',
  Project = 'project'
}

const storeTypeToConnectorType: Record<StoreType, ConnectorFilterProperties['types']> = {
  [StoreType.Github]: ['Github'],
  [StoreType.GitLab]: ['Gitlab'],
  [StoreType.Bitbucket]: ['Bitbucket'],
  [StoreType.Git]: ['Git'],
  [StoreType.AzureRepo]: ['AzureRepo']
}

export interface ConnectorSelection {
  identifier: string
  name: string
  scope: Scope
  orgIdentifier?: string
  projectIdentifier?: string
}

export interface LinkRepoConnectorDrawerProps {
  onConnectorSelect: (connector: ConnectorSelection) => void
  selectedLabel?: string
}

export const LinkRepoConnectorDrawer: FC<LinkRepoConnectorDrawerProps> = ({ onConnectorSelect, selectedLabel }) => {
  const { scope } = useMFEContext()
  const accountId = scope.accountId || ''
  const orgIdentifier = scope.orgIdentifier
  const projectIdentifier = scope.projectIdentifier

  const [isOpen, setIsOpen] = useState(false)
  const [storeType, setStoreType] = useState<StoreType>(StoreType.Github)
  const [activeScope, setActiveScope] = useState<Scope>(Scope.Project)
  const [searchTerm, setSearchTerm] = useState('')
  const [connectors, setConnectors] = useState<ConnectorResponse[]>([])

  const availableScopes = useMemo(() => {
    if (accountId && orgIdentifier && projectIdentifier) {
      return [Scope.Account, Scope.Organization, Scope.Project]
    }
    if (accountId && orgIdentifier) {
      return [Scope.Account, Scope.Organization]
    }
    return [Scope.Account]
  }, [accountId, orgIdentifier, projectIdentifier])

  const { mutateAsync: fetchConnectors, isLoading, error } = useGetConnectorListV2Mutation({})

  const loadConnectors = useCallback(() => {
    if (!accountId) return

    fetchConnectors({
      queryParams: {
        accountIdentifier: accountId,
        orgIdentifier: activeScope === Scope.Organization || activeScope === Scope.Project ? orgIdentifier : undefined,
        projectIdentifier: activeScope === Scope.Project ? projectIdentifier : undefined,
        pageIndex: 0,
        pageSize: 50,
        searchTerm: searchTerm || undefined,
        includeAllConnectorsAvailableAtScope: true,
        sortOrders: [{ fieldName: 'lastModifiedAt', orderType: 'DESC' }] as SortOrder[]
      },
      body: {
        filterType: 'Connector',
        types: storeTypeToConnectorType[storeType]
      }
    }).then(response => {
      setConnectors(response?.body?.data?.content || [])
    })
  }, [accountId, orgIdentifier, projectIdentifier, activeScope, storeType, searchTerm, fetchConnectors])

  useEffect(() => {
    if (isOpen) {
      loadConnectors()
    }
  }, [isOpen, loadConnectors])

  const handleScopeChange = useCallback((newScope: string) => {
    setActiveScope(newScope as Scope)
    setSearchTerm('')
    setConnectors([])
  }, [])

  const handleStoreTypeChange = useCallback((newType: StoreType) => {
    setStoreType(newType)
    setConnectors([])
  }, [])

  const handleSelectConnector = useCallback(
    (connector: ConnectorResponse) => {
      const connectorInfo = connector.connector
      if (!connectorInfo) return

      onConnectorSelect({
        identifier: connectorInfo.identifier,
        name: connectorInfo.name,
        scope: activeScope,
        orgIdentifier: connectorInfo.orgIdentifier,
        projectIdentifier: connectorInfo.projectIdentifier
      })
      setIsOpen(false)
    },
    [activeScope, onConnectorSelect]
  )

  return (
    <Layout.Vertical gap="sm">
      <Text variant="body-strong">Connector</Text>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger>
          <Button variant="outline" className="w-full justify-between">
            {selectedLabel ? <Text>{selectedLabel}</Text> : <Text color="foreground-3">Select connector</Text>}
            <IconV2 name="nav-arrow-right" size="xs" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Content size="md">
          <Drawer.Header>
            <Drawer.Title>Select Connector</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body>
            <Layout.Vertical gap="lg">
              <StoreTypeSelect value={storeType} onChange={handleStoreTypeChange} />

              <Tabs.Root value={activeScope} onValueChange={handleScopeChange}>
                <Tabs.List>
                  {availableScopes.map(s => (
                    <Tabs.Trigger key={s} value={s}>
                      {s === Scope.Account && 'Account'}
                      {s === Scope.Organization && 'Organization'}
                      {s === Scope.Project && 'Project'}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>

              <SearchInput placeholder="Search connectors..." value={searchTerm} onChange={setSearchTerm} />

              <Layout.Vertical gap="none">
                {isLoading ? (
                  <Skeleton.List linesCount={6} />
                ) : error ? (
                  <Text color="danger" className="py-cn-lg text-center">
                    Failed to load connectors
                  </Text>
                ) : connectors.length > 0 ? (
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head>Connector</Table.Head>
                        <Table.Head className="w-24">Scope</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {connectors.map(connector => {
                        const info = connector.connector
                        if (!info) return null
                        const scopeLabel = info.projectIdentifier ? 'Project' : info.orgIdentifier ? 'Org' : 'Account'
                        return (
                          <Table.Row
                            key={info.identifier}
                            className="cursor-pointer"
                            onClick={() => handleSelectConnector(connector)}
                          >
                            <Table.Cell>
                              <Layout.Horizontal gap="sm" align="center">
                                <LogoV2 name={getConnectorLogo(storeType)} size="sm" />
                                <Layout.Vertical gap="none">
                                  <Text variant="body-normal" truncate>
                                    {info.name}
                                  </Text>
                                  <Text variant="caption-normal" color="foreground-3" truncate>
                                    {info.identifier}
                                  </Text>
                                </Layout.Vertical>
                              </Layout.Horizontal>
                            </Table.Cell>
                            <Table.Cell>
                              <Text variant="caption-normal" color="foreground-3">
                                {scopeLabel}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table.Root>
                ) : (
                  <Text className="py-cn-lg text-center" color="foreground-3">
                    No connectors found
                  </Text>
                )}
              </Layout.Vertical>
            </Layout.Vertical>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Layout.Vertical>
  )
}

function getConnectorLogo(storeType: StoreType) {
  const map: Record<StoreType, string> = {
    [StoreType.Github]: 'github',
    [StoreType.GitLab]: 'gitlab',
    [StoreType.Bitbucket]: 'bitbucket',
    [StoreType.Git]: 'git',
    [StoreType.AzureRepo]: 'azure'
  }
  return map[storeType] as any
}

LinkRepoConnectorDrawer.displayName = 'LinkRepoConnectorDrawer'
