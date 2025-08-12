import { FC } from 'react'

import { IconV2, MoreActionsTooltip, NoData, Table, Tag, Text } from '@/components'
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
  createdIn?: string
}

const getDisplayPath = (scope: number, path?: string): string => {
  if (!path) return ''

  switch (scope) {
    case 0:
      return path
    case 1:
      return path.split('/')[0] || ''
    case 2:
      return path.split('/').slice(0, 2).join('/')
    default:
      return path.split('/').slice(0, 3).join('/')
  }
}

export const LabelsListView: FC<LabelsListViewProps> = ({
  labels,
  handleEditLabel,
  handleDeleteLabel,
  searchQuery,
  handleResetQueryAndPages,
  values,
  widthType = 'default',
  createdIn
}) => {
  const { t } = useTranslation()

  if (!labels.length) {
    if (searchQuery) {
      return (
        <NoData
          withBorder
          className="min-h-0 py-cn-xl"
          imageName="no-search-magnifying-glass"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          secondaryButton={{
            label: (
              <>
                <IconV2 name="trash" />
                {t('views:noData.clearSearch', 'Clear search')}
              </>
            ),
            onClick: handleResetQueryAndPages
          }}
        />
      )
    }

    return (
      <NoData
        withBorder
        className="min-h-0 py-cn-3xl"
        imageName="no-data-branches"
        title={t('views:noData.labels', 'No labels yet')}
        description={[t('views:noData.createLabel', 'Create a new label to get started.')]}
        primaryButton={{
          label: (
            <>
              <IconV2 name="plus" />
              {t('views:projectSettings.newLabels', 'Create Label')}
            </>
          ),
          to: 'create'
        }}
      />
    )
  }

  const isSmallWidth = widthType === 'small'

  return (
    <Table.Root tableClassName="table-fixed" className="mb-8 mt-4">
      <Table.Header>
        <Table.Row>
          <Table.Head className={cn('w-[304px]', { 'w-4/12': isSmallWidth })}>
            <Text variant="caption-strong" className="pl-[45px]">
              {t('views:labelData.table.name', 'Name')}
            </Text>
          </Table.Head>
          <Table.Head className="w-[240px]">
            <Text variant="caption-strong">{t('views:labelData.table.created', 'Created in')}</Text>
          </Table.Head>
          <Table.Head className={cn('w-[298px]', { 'w-5/12': isSmallWidth })}>
            <Text variant="caption-strong">{t('views:labelData.table.description', 'Description')}</Text>
          </Table.Head>
          <Table.Head className="w-[68px]" />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {labels.map(label => (
          <Table.Row key={label.id}>
            <Table.Cell className={cn('w-[304px] !py-3', { 'w-4/12': isSmallWidth })}>
              <LabelCellContent label={label} values={values?.[label.key]} />
            </Table.Cell>
            <Table.Cell className="w-[240px] !py-3.5 leading-none">
              <Tag
                theme="gray"
                variant="secondary"
                value={getDisplayPath(label.scope, createdIn)}
                icon={label.scope === 0 ? 'repository' : 'folder'}
              />
            </Table.Cell>
            <Table.Cell className={cn('w-[298px] !py-3', { 'w-5/12': isSmallWidth })}>
              <span className="line-clamp-3 break-words text-sm text-cn-foreground-3">{label?.description || ''}</span>
            </Table.Cell>
            <Table.Cell className="w-[68px] !py-2">
              <MoreActionsTooltip
                isInTable
                iconName="more-horizontal"
                actions={[
                  {
                    title: t('views:labelData.edit', 'Edit label'),
                    iconName: 'edit-pencil',
                    onClick: () => handleEditLabel(label)
                  },
                  {
                    isDanger: true,
                    title: t('views:labelData.delete', 'Delete label'),
                    iconName: 'trash',
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
