import { ColumnDef } from '@tanstack/react-table'

import { Button, Favorite, IconV2, Layout, ScopeTag, StatusBadge, Text, TimeAgoCard } from '@/components'
import { TFunctionWithFallback } from '@/context/translation-context'
import { Scope } from '@/views'
import { determineScope, getScopedPath } from '@components/scope/utils'

import { ForkedFrom } from '../components/forked-from'
import { RepositoryType } from '../repo.types'
import { RepoListColumn } from './constant'
import { FavoriteProps } from './types'

interface RepoListColumnOptions {
    t: TFunctionWithFallback
    scope: Scope
    showScope: boolean
    onFavoriteToggle: FavoriteProps['onFavoriteToggle']
    onCancelImport?: (repoId: string) => void
    toUpstreamRepo?: (parentRepoPath: string, subPath?: string) => string
}

export const getRepoListColumns = ({
    t,
    scope,
    onFavoriteToggle,
    onCancelImport,
    toUpstreamRepo
}: RepoListColumnOptions): ColumnDef<RepositoryType>[] => [
        {
            id: RepoListColumn.NAME,
            header: t('views:repos.name', 'Name'),
            enableSorting: true,
            enableHiding: false,
            cell: ({ row }) => {
                const { name, archived, upstream, importing } = row.original

                return (
                    <Layout.Vertical gap="2xs">
                        <Layout.Flex gap="xs" align="center">
                            <Text variant="heading-base" truncate>
                                {name}
                            </Text>
                            {archived && (
                                <StatusBadge variant="outline" size="sm" theme="warning">
                                    {t('views:repos.archived', 'Archived')}
                                </StatusBadge>
                            )}
                        </Layout.Flex>
                        {upstream && <ForkedFrom upstream={upstream} toUpstreamRepo={toUpstreamRepo} />}
                        {importing && (
                            <Text color="foreground-4" truncate>
                                {t('views:repos.importing', 'Importing…')}
                            </Text>
                        )}
                    </Layout.Vertical>
                )
            }
        },
        {
            id: RepoListColumn.SCOPE,
            header: t('views:scope.label', 'Scope'),
            enableSorting: false,
            enableHiding: true,
            maxSize: 200,
            cell: ({ row }) => {
                const { name, path } = row.original
                const repoScopeParams = { ...scope, repoIdentifier: name, repoPath: path }
                const scopeType = determineScope(repoScopeParams)
                const scopedPath = getScopedPath(repoScopeParams)
                if (!scopeType) return null
                return <ScopeTag scopeType={scopeType} scopedPath={scopedPath} size="sm" />
            }
        },
        {
            id: RepoListColumn.VISIBILITY,
            header: t('views:repos.visibility', 'Visibility'),
            enableSorting: false,
            enableHiding: true,
            size: 100,
            maxSize: 100,
            cell: ({ row }) => (
                <StatusBadge variant="outline" size="sm" theme={row.original.private ? 'muted' : 'success'}>
                    {row.original.private ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
                </StatusBadge>
            )
        },
        {
            id: RepoListColumn.PR,
            header: t('views:repos.pullRequests', 'Pull Requests'),
            enableSorting: false,
            enableHiding: true,
            size: 100,
            maxSize: 100,
            cell: ({ row }) => (
                <Layout.Flex gap="3xs" align="center">
                    <IconV2 name="git-pull-request" />
                    <Text as="span" color="foreground-1">
                        {row.original.pulls || 0}
                    </Text>
                </Layout.Flex>
            )
        },
        {
            id: RepoListColumn.UPDATED,
            header: t('views:repos.updated', 'Updated'),
            enableSorting: true,
            enableHiding: true,
            size: 100,
            maxSize: 100,
            cell: ({ row }) =>
                row.original.importing ? null : <TimeAgoCard timestamp={row.original.timestamp} />
        },
        {
            id: RepoListColumn.CREATED,
            header: t('views:repos.created', 'Created'),
            enableSorting: false,
            enableHiding: true,
            size: 100,
            maxSize: 100,
            cell: ({ row }) => <TimeAgoCard timestamp={row.original.createdAt} />
        },
        {
            id: RepoListColumn.DESCRIPTION,
            header: t('views:repos.description', 'Description'),
            enableSorting: false,
            enableHiding: true,
            size: 200,
            maxSize: 200,
            cell: ({ row }) => {
                if (row.original.importing) {
                    return (
                        <Text color="foreground-4" truncate>
                            {t('views:repos.importing', 'Importing…')}
                        </Text>
                    )
                }
                return (
                    <Text color="foreground-2" truncate>
                        {row.original.description}
                    </Text>
                )
            }
        },
        {
            id: 'actions',
            header: '',
            enableSorting: false,
            enableHiding: false,
            size: 45,
            maxSize: 45,
            cell: ({ row }) => {
                const repo = row.original
                if (repo.importing) {
                    return (
                        <Button
                            variant="ghost"
                            iconOnly
                            tooltipProps={{ content: t('views:repos.cancelImport', 'Cancel import') }}
                            onClick={e => {
                                e.stopPropagation()
                                onCancelImport?.(repo.name)
                            }}
                        >
                            <IconV2 name="xmark" skipSize />
                        </Button>
                    )
                }
                return (
                    <Favorite
                        isFavorite={repo.favorite}
                        onFavoriteToggle={isFavorite => {
                            onFavoriteToggle({ repoId: repo.id, isFavorite })
                        }}
                    />
                )
            }
        }
    ]