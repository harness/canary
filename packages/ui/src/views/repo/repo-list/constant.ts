import { CheckboxOptions } from '@components/filters'

export enum RepoListColumn {
  NAME = 'name',
  SCOPE = 'scope',
  VISIBILITY = 'visibility',
  PR = 'pr',
  DESCRIPTION = 'description',
  UPDATED = 'updated',
  CREATED = 'created'
}

export const DEFAULT_VISIBLE_COLUMNS = [RepoListColumn.VISIBILITY, RepoListColumn.UPDATED, RepoListColumn.PR]

export const COLUMN_OPTIONS: CheckboxOptions[] = [
  { label: 'Description', value: RepoListColumn.DESCRIPTION },
  { label: 'Scope', value: RepoListColumn.SCOPE },
  { label: 'Visibility', value: RepoListColumn.VISIBILITY },
  { label: 'Pull Requests', value: RepoListColumn.PR },
  { label: 'Updated', value: RepoListColumn.UPDATED },
  { label: 'Created', value: RepoListColumn.CREATED }
]
