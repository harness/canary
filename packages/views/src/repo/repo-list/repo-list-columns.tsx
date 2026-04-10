import { ColumnDef } from '@tanstack/react-table'
import { Scope } from '@views'

import {
  Button,
  determineScope,
  Favorite,
  getScopedPath,
  IconV2,
  Layout,
  ScopeTag,
  StatusBadge,
  Tag,
  Text,
  TimeAgoCard,
  Tooltip
} from '@harnessio/ui/components'
import { TFunctionWithFallback } from '@harnessio/ui/context'

import { ForkedFrom } from '../components/forked-from'
import { getLanguageColor } from '../constants/language-colors'
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
      const { name, archived, upstream, importing, repoType } = row.original
      const isLinked = repoType === 'linked'

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
              {isLinked ? t('views:repos.linking', 'Linking…') : t('views:repos.importing', 'Importing…')}
            </Text>
          )}
        </Layout.Vertical>
      )
    }
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
      if (!row.original.description) {
        return <Text color="disabled">-</Text>
      }
      return (
        <Text color="foreground-2" truncate>
          {row.original.description}
        </Text>
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
      if (!scopeType) return <Text color="disabled">-</Text>
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
    id: RepoListColumn.LANGUAGE,
    header: t('views:repos.language', 'Language'),
    enableSorting: false,
    enableHiding: true,
    size: 130,
    maxSize: 130,
    cell: ({ row }) => {
      const { language } = row.original
      if (!language) return <Text color="disabled">-</Text>

      return (
        <Layout.Flex gap="2xs" align="center">
          <div className="rounded-cn-full size-2.5 shrink-0" style={{ backgroundColor: getLanguageColor(language) }} />
          <Text color="foreground-2" truncate>
            {language}
          </Text>
        </Layout.Flex>
      )
    }
  },
  {
    id: RepoListColumn.TAGS,
    header: t('views:repos.resourceTags', 'Resource Tags'),
    enableSorting: false,
    enableHiding: true,
    size: 230,
    maxSize: 230,
    cell: ({ row }) => {
      const tags = row.original.tags ? Object.entries(row.original.tags) : []
      const maxVisibleTags = 3
      const visibleTags = tags.slice(0, maxVisibleTags)
      const remainingCount = tags.length - maxVisibleTags

      if (!tags.length) return <Text color="disabled">-</Text>

      return (
        <Layout.Horizontal className="overflow-hidden" wrap="wrap" gap="3xs">
          {visibleTags.map(([key, value]) => (
            <Tag key={key} label={key || value} value={value || ''} variant="outline" size="sm" theme="gray" />
          ))}
          {remainingCount > 0 && (
            <Tooltip
              content={
                <Layout.Horizontal className="w-cn-tooltip-md p-cn-xs" gap="3xs" wrap="wrap">
                  {tags.map(([key, value]) => (
                    <Tag key={key} label={key || value} value={value || ''} variant="outline" theme="gray" size="sm" />
                  ))}
                </Layout.Horizontal>
              }
            >
              <Tag value={`+${remainingCount}`} variant="outline" size="sm" />
            </Tooltip>
          )}
        </Layout.Horizontal>
      )
    }
  },
  {
    id: RepoListColumn.UPDATED,
    header: t('views:repos.updated', 'Updated'),
    enableSorting: true,
    enableHiding: true,
    size: 100,
    maxSize: 100,
    cell: ({ row }) =>
      row.original.importing ? <Text color="disabled">-</Text> : <TimeAgoCard timestamp={row.original.timestamp} />
  },
  {
    id: RepoListColumn.CREATED,
    header: t('views:repos.created', 'Created'),
    enableSorting: false,
    enableHiding: true,
    size: 200,
    maxSize: 200,
    cell: ({ row }) => {
      if (row.original.importing) {
        const isLinked = row.original.repoType === 'linked'
        return (
          <Text color="foreground-4" truncate>
            {isLinked ? t('views:repos.linking', 'Linking…') : t('views:repos.importing', 'Importing…')}
          </Text>
        )
      }
      return <TimeAgoCard timestamp={row.original.createdAt} />
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
