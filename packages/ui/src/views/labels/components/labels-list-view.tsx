import { FC } from 'react'

import {
  Icon,
  MoreActionsTooltip,
  NoData,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components'
import { ILabelsStore, ILabelType, LabelValuesType, TranslationStore } from '@/views'

import { LabelCellContent } from './label-cell-content'

export interface LabelsListViewProps {
  useTranslationStore: () => TranslationStore
  labels: ILabelType[]
  handleEditLabel: (label: ILabelType) => void
  handleDeleteLabel: (identifier: string) => void
  isDirtyList: boolean
  handleResetQueryAndPages: () => void
  searchQuery: string | null
  values: LabelValuesType
  useLabelsStore: () => ILabelsStore
}

export const LabelsListView: FC<LabelsListViewProps> = ({
  labels,
  handleEditLabel,
  handleDeleteLabel,
  useTranslationStore,
  searchQuery,
  handleResetQueryAndPages,
  values,
  useLabelsStore
}) => {
  const { t } = useTranslationStore()
  const { space_ref, repo_ref } = useLabelsStore!()

  if (!labels.length) {
    if (searchQuery) {
      return (
        <NoData
          withBorder
          iconName="no-search-magnifying-glass"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          primaryButton={{
            label: t('views:noData.clearSearch', 'Clear search'),
            onClick: handleResetQueryAndPages
          }}
        />
      )
    }

    return (
      <NoData
        withBorder
        iconName="no-data-branches"
        title={t('views:noData.labels', 'No labels yet')}
        description={[t('views:noData.createLabel', 'Create a new label to get started.')]}
        primaryButton={{
          label: t('views:projectSettings.newLabels', 'Create label'),
          to: 'create'
        }}
      />
    )
  }

  return (
    <Table tableClassName="table-fixed" variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="pl-[22px]">{t('views:labelData.table.name', 'Name')}</span>
          </TableHead>
          <TableHead>{t('views:labelData.table.created', 'Created in')}</TableHead>
          <TableHead>{t('views:labelData.table.description', 'Description')}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labels.map(label => (
          <TableRow key={label.key}>
            <TableCell className="w-1/4 !py-3">
              <LabelCellContent label={label} values={values} />
            </TableCell>
            <TableCell className="w-1/4 !py-3.5 leading-none">
              <span className="inline-flex h-4 max-w-full items-center gap-x-1 rounded bg-background-8 px-1.5 text-12 leading-4 text-foreground-8">
                <Icon
                  className="flex-none text-icons-9"
                  name={label.scope === 0 ? 'repo-icon' : 'folder-icon'}
                  size={12}
                />
                <span className="truncate">{label.scope === 0 ? (repo_ref ?? '') : (space_ref ?? '')}</span>
              </span>
            </TableCell>
            <TableCell className="w-1/2 !py-3">
              <span className="text-sm text-foreground-3">{label?.description || ''}</span>
            </TableCell>
            <TableCell className="w-[54px] !py-2 text-right">
              <MoreActionsTooltip
                isInTable
                actions={[
                  {
                    title: t('views:labelData.edit', 'Edit label'),
                    onClick: () => handleEditLabel(label)
                  },
                  {
                    isDanger: true,
                    title: t('views:labelData.delete', 'Delete label'),
                    onClick: () => handleDeleteLabel(label.key)
                  }
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
