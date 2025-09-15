import { DiffBlock } from '../../../pull-request-details-types'

export const blocks: DiffBlock[] = [
  {
    lines: [
      {
        content:
          "-import { IconV2, NoData, SkeletonList, StackedList, StatusBadge, Text, TimeAgoCard } from '@/components'",
        type: 'delete',
        oldNumber: 1
      },
      {
        content:
          "+import { Favorite, IconV2, NoData, SkeletonList, StackedList, StatusBadge, Text, TimeAgoCard } from '@/components'",
        type: 'insert',
        newNumber: 1
      },
      {
        content: " import { useRouterContext, useTranslation } from '@/context'",
        type: 'context',
        oldNumber: 2,
        newNumber: 2
      },
      {
        content: " import { cn } from '@utils/cn'",
        type: 'context',
        oldNumber: 3,
        newNumber: 3
      },
      {
        content: ' ',
        type: 'context',
        oldNumber: 4,
        newNumber: 4
      },
      {
        content: " import { RepositoryType } from '../repo.types'",
        type: 'context',
        oldNumber: 5,
        newNumber: 5
      },
      {
        content: "-import { RoutingProps } from './types'",
        type: 'delete',
        oldNumber: 6
      },
      {
        content: "+import { FavoriteProps, RoutingProps } from './types'",
        type: 'insert',
        newNumber: 6
      },
      {
        content: ' ',
        type: 'context',
        oldNumber: 7,
        newNumber: 7
      },
      {
        content: '-export interface PageProps extends Partial<RoutingProps> {',
        type: 'delete',
        oldNumber: 8
      },
      {
        content: '+export interface PageProps extends Partial<RoutingProps>, FavoriteProps {',
        type: 'insert',
        newNumber: 8
      },
      {
        content: '   repos: RepositoryType[]',
        type: 'context',
        oldNumber: 9,
        newNumber: 9
      },
      {
        content: '   handleResetFiltersQueryAndPages: () => void',
        type: 'context',
        oldNumber: 10,
        newNumber: 10
      },
      {
        content: '   isDirtyList: boolean',
        type: 'context',
        oldNumber: 11,
        newNumber: 11
      }
    ],
    oldStartLine: 1,
    oldStartLine2: null,
    newStartLine: 1,
    header: '@@ -1,11 +1,11 @@'
  },
  {
    lines: [
      {
        content: '   </div>',
        type: 'context',
        oldNumber: 21,
        newNumber: 21
      },
      {
        content: ' )',
        type: 'context',
        oldNumber: 22,
        newNumber: 22
      },
      {
        content: ' ',
        type: 'context',
        oldNumber: 23,
        newNumber: 23
      },
      {
        content: '-const Title = ({ title, isPrivate }: { title: string; isPrivate: boolean }) => {',
        type: 'delete',
        oldNumber: 24
      },
      {
        content: '+const Title = ({',
        type: 'insert',
        newNumber: 24
      },
      {
        content: '+  repoId,',
        type: 'insert',
        newNumber: 25
      },
      {
        content: '+  title,',
        type: 'insert',
        newNumber: 26
      },
      {
        content: '+  isPrivate,',
        type: 'insert',
        newNumber: 27
      },
      {
        content: '+  isFavorite,',
        type: 'insert',
        newNumber: 28
      },
      {
        content: '+  onFavoriteToggle',
        type: 'insert',
        newNumber: 29
      },
      {
        content: '+}: {',
        type: 'insert',
        newNumber: 30
      },
      {
        content: '+  repoId: string',
        type: 'insert',
        newNumber: 31
      },
      {
        content: '+  title: string',
        type: 'insert',
        newNumber: 32
      },
      {
        content: '+  isPrivate: boolean',
        type: 'insert',
        newNumber: 33
      },
      {
        content: '+  isFavorite?: boolean',
        type: 'insert',
        newNumber: 34
      },
      {
        content: "+  onFavoriteToggle: PageProps['onFavoriteToggle']",
        type: 'insert',
        newNumber: 35
      },
      {
        content: '+}) => {',
        type: 'insert',
        newNumber: 36
      },
      {
        content: '   const { t } = useTranslation()',
        type: 'context',
        oldNumber: 25,
        newNumber: 37
      },
      {
        content: '   return (',
        type: 'context',
        oldNumber: 26,
        newNumber: 38
      },
      {
        content: '     <div className="inline-flex items-center gap-2.5">',
        type: 'context',
        oldNumber: 27,
        newNumber: 39
      }
    ],
    oldStartLine: 21,
    oldStartLine2: null,
    newStartLine: 21,
    header: '@@ -21,7 +21,19 @@ const Stats = ({ pulls }: { pulls: number }) => ('
  },
  {
    lines: [
      {
        content: '       <StatusBadge variant="outline" size="sm" theme={isPrivate ? \'muted\' : \'success\'}>',
        type: 'context',
        oldNumber: 29,
        newNumber: 41
      },
      {
        content: "         {isPrivate ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}",
        type: 'context',
        oldNumber: 30,
        newNumber: 42
      },
      {
        content: '       </StatusBadge>',
        type: 'context',
        oldNumber: 31,
        newNumber: 43
      },
      {
        content: '+      <Favorite',
        type: 'insert',
        newNumber: 44
      },
      {
        content: '+        isFavorite={isFavorite}',
        type: 'insert',
        newNumber: 45
      },
      {
        content: '+        onFavoriteToggle={isFavorite => onFavoriteToggle({ repoId, isFavorite: !isFavorite })}',
        type: 'insert',
        newNumber: 46
      },
      {
        content: '+      />',
        type: 'insert',
        newNumber: 47
      },
      {
        content: '     </div>',
        type: 'context',
        oldNumber: 32,
        newNumber: 48
      },
      {
        content: '   )',
        type: 'context',
        oldNumber: 33,
        newNumber: 49
      },
      {
        content: ' }',
        type: 'context',
        oldNumber: 34,
        newNumber: 50
      }
    ],
    oldStartLine: 29,
    oldStartLine2: null,
    newStartLine: 41,
    header: '@@ -29,6 +41,10 @@ const Title = ({ title, isPrivate }: { title: string; isPrivate: boolean }) => {'
  },
  {
    lines: [
      {
        content: '   isLoading,',
        type: 'context',
        oldNumber: 40,
        newNumber: 56
      },
      {
        content: '   toRepository,',
        type: 'context',
        oldNumber: 41,
        newNumber: 57
      },
      {
        content: '   toCreateRepo,',
        type: 'context',
        oldNumber: 42,
        newNumber: 58
      },
      {
        content: '-  toImportRepo',
        type: 'delete',
        oldNumber: 43
      },
      {
        content: '+  toImportRepo,',
        type: 'insert',
        newNumber: 59
      },
      {
        content: '+  onFavoriteToggle',
        type: 'insert',
        newNumber: 60
      },
      {
        content: ' }: PageProps) {',
        type: 'context',
        oldNumber: 44,
        newNumber: 61
      },
      {
        content: '   const { Link } = useRouterContext()',
        type: 'context',
        oldNumber: 45,
        newNumber: 62
      },
      {
        content: '   const { t } = useTranslation()',
        type: 'context',
        oldNumber: 46,
        newNumber: 63
      }
    ],
    oldStartLine: 40,
    oldStartLine2: null,
    newStartLine: 56,
    header: '@@ -40,7 +56,8 @@ export function RepoList({'
  },
  {
    lines: [
      {
        content: '                   <span className="max-w-full truncate">{repo.description}</span>',
        type: 'context',
        oldNumber: 102,
        newNumber: 119
      },
      {
        content: '                 )',
        type: 'context',
        oldNumber: 103,
        newNumber: 120
      },
      {
        content: '               }',
        type: 'context',
        oldNumber: 104,
        newNumber: 121
      },
      {
        content: '-              title={<Title title={repo.name} isPrivate={repo.private} />}',
        type: 'delete',
        oldNumber: 105
      },
      {
        content: '+              title={',
        type: 'insert',
        newNumber: 122
      },
      {
        content: '+                <Title',
        type: 'insert',
        newNumber: 123
      },
      {
        content: '+                  repoId={repo.identifier}',
        type: 'insert',
        newNumber: 124
      },
      {
        content: '+                  title={repo.name}',
        type: 'insert',
        newNumber: 125
      },
      {
        content: '+                  isPrivate={repo.private}',
        type: 'insert',
        newNumber: 126
      },
      {
        content: '+                  isFavorite={repo.favorite}',
        type: 'insert',
        newNumber: 127
      },
      {
        content: '+                  onFavoriteToggle={onFavoriteToggle}',
        type: 'insert',
        newNumber: 128
      },
      {
        content: '+                />',
        type: 'insert',
        newNumber: 129
      },
      {
        content: '+              }',
        type: 'insert',
        newNumber: 130
      },
      {
        content: '               className="flex max-w-[80%] gap-1.5 text-wrap"',
        type: 'context',
        oldNumber: 106,
        newNumber: 131
      },
      {
        content: '             />',
        type: 'context',
        oldNumber: 107,
        newNumber: 132
      },
      {
        content: '             {!repo.importing && (',
        type: 'context',
        oldNumber: 108,
        newNumber: 133
      }
    ],
    oldStartLine: 102,
    oldStartLine2: null,
    newStartLine: 119,
    header: '@@ -102,7 +119,15 @@ export function RepoList({'
  }
] as unknown as DiffBlock[]

export const blocks2: DiffBlock[] = [
  {
    lines: [
      {
        content: "-import { RepoRepositoryOutput } from '@harnessio/code-service-client'",
        type: 'delete',
        oldNumber: 1
      },
      {
        content: '-',
        type: 'delete',
        oldNumber: 2
      },
      {
        content: " import { transformRepoList } from '../repo-list-transform'",
        type: 'context',
        oldNumber: 3,
        newNumber: 1
      },
      {
        content: ' ',
        type: 'context',
        oldNumber: 4,
        newNumber: 2
      },
      {
        content: ' // Mock data',
        type: 'context',
        oldNumber: 5,
        newNumber: 3
      },
      {
        content: '-const mockRepos: RepoRepositoryOutput[] = [',
        type: 'delete',
        oldNumber: 6
      },
      {
        content: '+/**',
        type: 'insert',
        newNumber: 4
      },
      {
        content: '+ * @todo add type info here once api contract is updated',
        type: 'insert',
        newNumber: 5
      },
      {
        content: '+ */',
        type: 'insert',
        newNumber: 6
      },
      {
        content: '+const mockRepos = [',
        type: 'insert',
        newNumber: 7
      },
      {
        content: '   {',
        type: 'context',
        oldNumber: 7,
        newNumber: 8
      },
      {
        content: '     id: 1,',
        type: 'context',
        oldNumber: 8,
        newNumber: 9
      },
      {
        content: "     identifier: 'repo1',",
        type: 'context',
        oldNumber: 9,
        newNumber: 10
      }
    ],
    oldStartLine: 1,
    oldStartLine2: null,
    newStartLine: 1,
    header: '@@ -1,9 +1,10 @@'
  },
  {
    lines: [
      {
        content: '     num_pulls: 10,',
        type: 'context',
        oldNumber: 13,
        newNumber: 14
      },
      {
        content: '     updated: 1617181723,',
        type: 'context',
        oldNumber: 14,
        newNumber: 15
      },
      {
        content: '     created: 1617181723,',
        type: 'context',
        oldNumber: 15,
        newNumber: 16
      },
      {
        content: '-    importing: false',
        type: 'delete',
        oldNumber: 16
      },
      {
        content: '+    importing: false,',
        type: 'insert',
        newNumber: 17
      },
      {
        content: '+    is_favorite: true',
        type: 'insert',
        newNumber: 18
      },
      {
        content: '   }',
        type: 'context',
        oldNumber: 17,
        newNumber: 19
      },
      {
        content: ' ]',
        type: 'context',
        oldNumber: 18,
        newNumber: 20
      },
      {
        content: ' ',
        type: 'context',
        oldNumber: 19,
        newNumber: 21
      }
    ],
    oldStartLine: 13,
    oldStartLine2: null,
    newStartLine: 14,
    header: '@@ -13,7 +14,8 @@ const mockRepos: RepoRepositoryOutput[] = ['
  },
  {
    lines: [
      {
        content: '         pulls: 10,',
        type: 'context',
        oldNumber: 33,
        newNumber: 35
      },
      {
        content: "         timestamp: '1970-01-19T17:13:01.723Z', // Epoch gets converted to ISO-8601 string",
        type: 'context',
        oldNumber: 34,
        newNumber: 36
      },
      {
        content: '         createdAt: 1617181723,',
        type: 'context',
        oldNumber: 35,
        newNumber: 37
      },
      {
        content: '-        importing: false',
        type: 'delete',
        oldNumber: 36
      },
      {
        content: '+        importing: false,',
        type: 'insert',
        newNumber: 38
      },
      {
        content: '+        favorite: true',
        type: 'insert',
        newNumber: 39
      },
      {
        content: '       }',
        type: 'context',
        oldNumber: 37,
        newNumber: 40
      },
      {
        content: '     ])',
        type: 'context',
        oldNumber: 38,
        newNumber: 41
      },
      {
        content: '   })',
        type: 'context',
        oldNumber: 39,
        newNumber: 42
      }
    ],
    oldStartLine: 33,
    oldStartLine2: null,
    newStartLine: 35,
    header: "@@ -33,7 +35,8 @@ describe('transformRepoList', () => {"
  }
] as unknown as DiffBlock[]
