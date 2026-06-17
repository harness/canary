import { FC, useCallback, useEffect, useState } from 'react'

import {
  GitRepositoryResponseDto,
  useGetPaginatedListOfReposByRefConnectorQuery
} from '@harnessio/react-ng-manager-swagger-service-client'
import { Button, Drawer, IconV2, Layout, SearchInput, Skeleton, Table, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { useMFEContext } from '../framework/hooks/useMFEContext'

export interface LinkRepoProviderRepoSelectProps {
  connectorRef: string
  selectedRepoIdentifier?: string
  onSelect: (repoIdentifier: string) => void
}

export const LinkRepoProviderRepoSelect: FC<LinkRepoProviderRepoSelectProps> = ({
  connectorRef,
  selectedRepoIdentifier = '',
  onSelect
}) => {
  const { t } = useTranslation()
  const { scope } = useMFEContext()
  const accountId = scope.accountId || ''
  const orgIdentifier = scope.orgIdentifier
  const projectIdentifier = scope.projectIdentifier

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLabel, setSelectedLabel] = useState('')

  useEffect(() => {
    setSelectedLabel(selectedRepoIdentifier)
  }, [selectedRepoIdentifier])

  useEffect(() => {
    setSelectedLabel('')
    setSearchTerm('')
    setIsOpen(false)
  }, [connectorRef])

  // v2 endpoint supports server-side filtering via repoNameSearchTerm (v1 ignores it).
  const { data, isLoading, isFetching, isError, error } = useGetPaginatedListOfReposByRefConnectorQuery(
    {
      queryParams: {
        accountIdentifier: accountId,
        orgIdentifier,
        projectIdentifier,
        connectorRef,
        repoNameSearchTerm: searchTerm || undefined,
        page: 0,
        size: 50
      }
    },
    { enabled: isOpen && Boolean(accountId && connectorRef) }
  )

  const repos = data?.content?.data?.gitRepositoryResponseList ?? []

  const errorMessage = isError
    ? (error?.message ?? t('views:repos.link.selectProviderRepo.failedToLoad', 'Failed to load repositories'))
    : null

  const handleSelectRepo = useCallback(
    (repo: GitRepositoryResponseDto) => {
      const name = repo.name?.trim()
      if (!name) return

      setSelectedLabel(name)
      onSelect(name)
      setIsOpen(false)
    },
    [onSelect]
  )

  const isDisabled = !connectorRef

  return (
    <Layout.Vertical gap="sm">
      <Text variant="body-strong">{t('views:repos.link.selectProviderRepo.label', 'Repository on Git provider')}</Text>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger>
          <Button variant="outline" className="w-full justify-between" disabled={isDisabled}>
            {selectedLabel ? (
              <Text truncate>{selectedLabel}</Text>
            ) : (
              <Text color="foreground-3">
                {t('views:repos.link.selectProviderRepo.placeholder', 'Select repository')}
              </Text>
            )}
            <IconV2 name="nav-arrow-right" size="xs" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Content size="md">
          <Drawer.Header>
            <Drawer.Title>{t('views:repos.link.selectProviderRepo.title', 'Select repository')}</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body>
            <Layout.Vertical gap="lg">
              <Text color="foreground-3">
                {t(
                  'views:repos.link.selectProviderRepo.description',
                  'Select the repository on your Git provider to link (required for account-level connectors).'
                )}
              </Text>

              <SearchInput
                placeholder={t('views:repos.link.selectProviderRepo.searchPlaceholder', 'Search repositories...')}
                searchValue={searchTerm}
                onChange={setSearchTerm}
              />

              <Layout.Vertical gap="none">
                {isLoading || isFetching ? (
                  <Skeleton.List linesCount={6} />
                ) : errorMessage ? (
                  <Text color="danger" className="py-cn-lg text-center">
                    {errorMessage}
                  </Text>
                ) : repos.length > 0 ? (
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head>{t('views:repos.link.selectProviderRepo.repoColumn', 'Repository')}</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {repos.map(repo => {
                        const name = repo.name ?? ''
                        return (
                          <Table.Row key={name} className="cursor-pointer" onClick={() => handleSelectRepo(repo)}>
                            <Table.Cell>
                              <Text variant="body-normal" truncate>
                                {name}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table.Root>
                ) : (
                  <Text className="py-cn-lg text-center" color="foreground-3">
                    {t('views:repos.link.selectProviderRepo.noReposFound', 'No repositories found')}
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

LinkRepoProviderRepoSelect.displayName = 'LinkRepoProviderRepoSelect'
