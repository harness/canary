import { FC, useCallback, useEffect, useState } from 'react'

import {
  Button,
  Drawer,
  IconV2,
  Layout,
  SearchInput,
  Skeleton,
  Table,
  Text
} from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { useDebounceSearch } from '@harnessio/ui/hooks'

import { useMFEContext } from '../framework/hooks/useMFEContext'
import { GitRepositoryResponseDTO, listReposByConnector } from '../utils/list-repos-by-connector'

export const ACCOUNT_CONNECTOR_SPEC_TYPE = 'Account'

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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [repos, setRepos] = useState<GitRepositoryResponseDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLabel, setSelectedLabel] = useState('')

  const { handleStringSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setDebouncedSearchTerm
  })

  useEffect(() => {
    setSelectedLabel(selectedRepoIdentifier)
  }, [selectedRepoIdentifier])

  useEffect(() => {
    setSelectedLabel('')
    setDebouncedSearchTerm('')
    setIsOpen(false)
  }, [connectorRef])

  const loadRepos = useCallback(async () => {
    if (!accountId || !connectorRef) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await listReposByConnector({
        accountIdentifier: accountId,
        orgIdentifier,
        projectIdentifier,
        connectorRef,
        repoNameSearchTerm: debouncedSearchTerm || undefined
      })
      setRepos(data)
    } catch (err) {
      setRepos([])
      setError(
        err instanceof Error
          ? err.message
          : t('views:repos.link.selectProviderRepo.failedToLoad', 'Failed to load repositories')
      )
    } finally {
      setIsLoading(false)
    }
  }, [accountId, connectorRef, debouncedSearchTerm, orgIdentifier, projectIdentifier, t])

  useEffect(() => {
    if (isOpen && connectorRef) {
      loadRepos()
    }
  }, [isOpen, connectorRef, loadRepos])

  const handleSelectRepo = useCallback(
    (repo: GitRepositoryResponseDTO) => {
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
                onChange={handleStringSearchChange}
              />

              <Layout.Vertical gap="none">
                {isLoading ? (
                  <Skeleton.List linesCount={6} />
                ) : error ? (
                  <Text color="danger" className="py-cn-lg text-center">
                    {error}
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
                          <Table.Row
                            key={name}
                            className="cursor-pointer"
                            onClick={() => handleSelectRepo(repo)}
                          >
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
