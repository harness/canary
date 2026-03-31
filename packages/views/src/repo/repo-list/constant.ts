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
  RepoListColumn.SCOPE,
  RepoListColumn.VISIBILITY,
  RepoListColumn.LANGUAGE,
  RepoListColumn.TAGS,
  RepoListColumn.UPDATED
]

export const COLUMN_OPTIONS: CheckboxOptions[] = [
  { label: 'Description', value: RepoListColumn.DESCRIPTION },
  { label: 'Scope', value: RepoListColumn.SCOPE },
  { label: 'Visibility', value: RepoListColumn.VISIBILITY },
  { label: 'Language', value: RepoListColumn.LANGUAGE },
  { label: 'Resource Tags', value: RepoListColumn.TAGS },
  { label: 'Updated', value: RepoListColumn.UPDATED },
  { label: 'Created', value: RepoListColumn.CREATED },
  { label: 'Pull requests', value: RepoListColumn.PR }
]
