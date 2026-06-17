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
import { useTranslation } from '@harnessio/ui/context'

import { useMFEContext } from '../framework/hooks/useMFEContext'
import { getGitConnectorUrlType, GitConnectorUrlType } from '../utils/git-connector-url-type'
import { StoreType, storeTypeConfig, StoreTypeSelect } from './store-type-select'

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
  accountIdentifier?: string
  orgIdentifier?: string
  projectIdentifier?: string
  /** Git connector URL scope: Account, Repo, or Project (Azure/GitLab). */
  specType?: GitConnectorUrlType
}

export interface LinkRepoConnectorDrawerProps {
  onConnectorSelect: (connector: ConnectorSelection) => void
}

const deriveScope = (connector: { orgIdentifier?: string; projectIdentifier?: string }): Scope => {
  if (connector.projectIdentifier) return Scope.Project
  if (connector.orgIdentifier) return Scope.Organization
  return Scope.Account
}

export const LinkRepoConnectorDrawer: FC<LinkRepoConnectorDrawerProps> = ({ onConnectorSelect }) => {
  const { t } = useTranslation()
  const { scope } = useMFEContext()
  const accountId = scope.accountId || ''
  const orgIdentifier = scope.orgIdentifier
  const projectIdentifier = scope.projectIdentifier

  const [isOpen, setIsOpen] = useState(false)
  const [storeType, setStoreType] = useState<StoreType>(StoreType.Github)
  const [activeScope, setActiveScope] = useState<Scope>(Scope.Project)
  const [searchTerm, setSearchTerm] = useState('')
  const [connectors, setConnectors] = useState<ConnectorResponse[]>([])
  const [selectedLabel, setSelectedLabel] = useState<string>('')

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

  const loadConnectors = useCallback(async () => {
    if (!accountId) return

    try {
      const response = await fetchConnectors({
        queryParams: {
          accountIdentifier: accountId,
          orgIdentifier:
            activeScope === Scope.Organization || activeScope === Scope.Project ? orgIdentifier : undefined,
          projectIdentifier: activeScope === Scope.Project ? projectIdentifier : undefined,
          pageIndex: 0,
          pageSize: 50,
          searchTerm: searchTerm || undefined,
          sortOrders: [{ fieldName: 'lastModifiedAt', orderType: 'DESC' }] as SortOrder[]
        },
        body: {
          filterType: 'Connector',
          types: storeTypeToConnectorType[storeType]
        }
      })
      setConnectors(response?.body?.data?.content || [])
    } catch {
      // Surfaced via the `error` state from useGetConnectorListV2Mutation.
      setConnectors([])
    }
  }, [accountId, orgIdentifier, projectIdentifier, activeScope, storeType, searchTerm])

  useEffect(() => {
    if (isOpen) {
      loadConnectors()
    }
  }, [isOpen, loadConnectors])

  const handleScopeChange = useCallback((newScope: string) => {
    setActiveScope(newScope as Scope)
    setSearchTerm('')
  }, [])

  const handleStoreTypeChange = useCallback((newType: StoreType) => {
    setStoreType(newType)
  }, [])

  const handleSelectConnector = useCallback(
    (connector: ConnectorResponse) => {
      const connectorInfo = connector.connector
      if (!connectorInfo) return

      onConnectorSelect({
        identifier: connectorInfo.identifier,
        name: connectorInfo.name,
        scope: deriveScope(connectorInfo),
        accountIdentifier: connectorInfo.accountIdentifier,
        orgIdentifier: connectorInfo.orgIdentifier,
        projectIdentifier: connectorInfo.projectIdentifier,
        specType: getGitConnectorUrlType(connectorInfo)
      })
      setSelectedLabel(connectorInfo.name)
      setIsOpen(false)
    },
    [onConnectorSelect]
  )

  const renderScopeLabel = (info: { orgIdentifier?: string; projectIdentifier?: string }) => {
    if (info.projectIdentifier) return t('views:repos.link.selectConnector.project', 'Project')
    if (info.orgIdentifier) return t('views:repos.link.selectConnector.org', 'Org')
    return t('views:repos.account', 'Account')
  }

  return (
    <Layout.Vertical gap="sm">
      <Text variant="body-strong">{t('views:repos.link.connector', 'Connector')}</Text>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger>
          <Button variant="outline" className="w-full justify-between">
            {selectedLabel ? (
              <Text>{selectedLabel}</Text>
            ) : (
              <Text color="foreground-3">{t('views:repos.link.selectConnector.placeholder', 'Select connector')}</Text>
            )}
            <IconV2 name="nav-arrow-right" size="xs" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Content size="md">
          <Drawer.Header>
            <Drawer.Title>{t('views:repos.link.selectConnector.title', 'Select Connector')}</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body>
            <Layout.Vertical gap="lg">
              <StoreTypeSelect value={storeType} onChange={handleStoreTypeChange} allowedTypes={[StoreType.Github]} />

              <Tabs.Root value={activeScope} onValueChange={handleScopeChange}>
                <Tabs.List>
                  {availableScopes.map(s => (
                    <Tabs.Trigger key={s} value={s}>
                      {s === Scope.Account && t('views:repos.account', 'Account')}
                      {s === Scope.Organization && t('views:repos.organization', 'Organization')}
                      {s === Scope.Project && t('views:repos.link.selectConnector.project', 'Project')}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>

              <SearchInput
                placeholder={t('views:repos.link.selectConnector.searchPlaceholder', 'Search connectors...')}
                searchValue={searchTerm}
                onChange={setSearchTerm}
              />

              <Layout.Vertical gap="none">
                {isLoading ? (
                  <Skeleton.List linesCount={6} />
                ) : error ? (
                  <Text color="danger" className="py-cn-lg text-center">
                    {t('views:repos.link.selectConnector.failedToLoad', 'Failed to load connectors')}
                  </Text>
                ) : connectors.length > 0 ? (
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head>{t('views:repos.link.selectConnector.connectorColumn', 'Connector')}</Table.Head>
                        <Table.Head className="w-24">
                          {t('views:repos.link.selectConnector.scopeColumn', 'Scope')}
                        </Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {connectors.map(connector => {
                        const info = connector.connector
                        if (!info) return null
                        return (
                          <Table.Row
                            key={info.identifier}
                            className="cursor-pointer"
                            onClick={() => handleSelectConnector(connector)}
                          >
                            <Table.Cell>
                              <Layout.Horizontal gap="sm" align="center">
                                <LogoV2 name={storeTypeConfig[storeType].logo} size="sm" />
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
                                {renderScopeLabel(info)}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table.Root>
                ) : (
                  <Text className="py-cn-lg text-center" color="foreground-3">
                    {t('views:repos.link.selectConnector.noConnectorsFound', 'No connectors found')}
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

LinkRepoConnectorDrawer.displayName = 'LinkRepoConnectorDrawer'
