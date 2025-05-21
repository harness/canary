import { FC } from 'react'

import { Icon, MoreActionsTooltip, NoData, Table } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { ILabelType, LabelValuesType } from '@/views'

import { LabelCellContent } from './label-cell-content'

export interface LabelsListViewProps {
  labels: ILabelType[]
  handleEditLabel: (label: ILabelType) => void
  handleDeleteLabel: (identifier: string) => void
  handleResetQueryAndPages: () => void
  searchQuery: string | null
  values: LabelValuesType
  /**
   * Context of the label; can be a repo or a space
   */
  labelContext: { space: string | null; repo: string | null }
  /**
   * When the widthType is set to 'small', 'name' column is bigger and 'description' column is smaller
   */
  widthType?: 'default' | 'small'
}

export const LabelsListView: FC<LabelsListViewProps> = ({
  labels,
  handleEditLabel,
  handleDeleteLabel,
  searchQuery,
  handleResetQueryAndPages,
  values,
  widthType = 'default',
  labelContext
}) => {
  const { t } = useTranslation()

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
          primaryButton={{ label: t('views:noData.clearSearch', 'Clear search'), onClick: handleResetQueryAndPages }}
        />
      )
    }

    return (
      <NoData
        withBorder
        iconName="no-data-branches"
        title={t('views:noData.labels', 'No labels yet')}
        description={[t('views:noData.createLabel', 'Create a new label to get started.')]}
        primaryButton={{ label: t('views:projectSettings.newLabels', 'Create label'), to: 'create' }}
      />
    )
  }

  const isSmallWidth = widthType === 'small'

  return (
    <Table.Root tableClassName="table-fixed" variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head className={cn('w-1/4', { 'w-4/12': isSmallWidth })}>
            <span className="pl-[22px]">{t('views:labelData.table.name', 'Name')}</span>
          </Table.Head>
          <Table.Head className="w-1/4">{t('views:labelData.table.created', 'Created in')}</Table.Head>
          <Table.Head className={cn('w-1/2', { 'w-5/12': isSmallWidth })}>
            {t('views:labelData.table.description', 'Description')}
          </Table.Head>
          <Table.Head className="w-[54px]" />
        </Table.Row>
      </Table.Header>

      <Table.Body hasHighlightOnHover>
        {labels.map(label => (
          <Table.Row key={label.id}>
            <Table.Cell className={cn('w-1/4 !py-3', { 'w-4/12': isSmallWidth })}>
              <LabelCellContent label={label} values={values?.[label.key]} />
            </Table.Cell>
            <Table.Cell className="w-1/4 !py-3.5 leading-none">
              <span className="inline-flex h-4 max-w-full items-center gap-x-1 rounded bg-cn-background-8 px-1.5 text-1 leading-4 text-cn-foreground-1">
                <Icon
                  className="flex-none text-icons-9"
                  name={label.scope === 0 ? 'repo-icon' : 'folder-icon'}
                  size={12}
                />

                <span
                  className="truncate"
                  title={label.scope === 0 ? (labelContext.repo ?? '') : (labelContext.space ?? '')}
                >
                  {label.scope === 0 ? labelContext.repo : labelContext.space}
                </span>
              </span>
            </Table.Cell>
            <Table.Cell className={cn('w-1/2 !py-3', { 'w-5/12': isSmallWidth })}>
              <span className="line-clamp-3 break-words text-sm text-cn-foreground-3">{label?.description || ''}</span>
            </Table.Cell>
            <Table.Cell className="w-[54px] !py-2 text-right">
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
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
