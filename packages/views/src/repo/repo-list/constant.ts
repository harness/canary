import { CheckboxOptions } from '@harnessio/ui/components'

export enum RepoListColumn {
  NAME = 'name',
  SCOPE = 'scope',
  VISIBILITY = 'visibility',
  LANGUAGE = 'language',
  PR = 'pr',
  TAGS = 'tags',
  DESCRIPTION = 'description',
  UPDATED = 'updated',
  CREATED = 'created'
}

export const DEFAULT_VISIBLE_COLUMNS = [
  RepoListColumn.VISIBILITY,
  RepoListColumn.LANGUAGE,
  RepoListColumn.UPDATED,
  RepoListColumn.PR,
  RepoListColumn.TAGS
]

export const COLUMN_OPTIONS: CheckboxOptions[] = [
  { label: 'Description', value: RepoListColumn.DESCRIPTION },
  { label: 'Scope', value: RepoListColumn.SCOPE },
  { label: 'Visibility', value: RepoListColumn.VISIBILITY },
  { label: 'Language', value: RepoListColumn.LANGUAGE },
  { label: 'Pull Requests', value: RepoListColumn.PR },
  { label: 'Tags', value: RepoListColumn.TAGS },
  { label: 'Updated', value: RepoListColumn.UPDATED },
  { label: 'Created', value: RepoListColumn.CREATED }
]
