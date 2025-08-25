import { FC, useState } from 'react'

import { Button, getScopeType, IconV2, Layout, MoreActionsTooltip, NoData, ScopeTag, Table, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { ILabelType, LabelTag, LabelType, LabelValuesType } from '@/views'

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
  toRepoLabelDetails?: ({ labelId, scope }: { labelId: string; scope: number }) => string
}

export const LabelsListView: FC<LabelsListViewProps> = ({
  labels,
  handleEditLabel,
  handleDeleteLabel,
  searchQuery,
  handleResetQueryAndPages,
  values,
  widthType = 'default',
  toRepoLabelDetails
}) => {
  const { t } = useTranslation()
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!labels.length) {
    if (searchQuery) {
      return (
        <NoData
          withBorder
          className="min-h-0"
          imageName="no-search-magnifying-glass"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          secondaryButton={{
            icon: 'trash',
            label: t('views:noData.clearSearch', 'Clear search'),
            onClick: handleResetQueryAndPages
          }}
        />
      )
    }

    return (
      <NoData
        className="min-h-0"
        imageName="no-data-labels"
        title={t('views:noData.labels', 'No labels yet')}
        description={[t('views:noData.createLabel', 'Create a new label to get started.')]}
        primaryButton={{
          icon: 'plus',
          label: t('views:projectSettings.newLabels', 'Create Label'),
          to: 'create'
        }}
      />
    )
  }

  const isSmallWidth = widthType === 'small'

  return (
    <Table.Root size="compact">
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[44px]" />
          <Table.Head className={cn('min-w-[150px] w-[25%]')} hideDivider>
            <Text variant="caption-strong">{t('views:labelData.table.name', 'Name')}</Text>
          </Table.Head>
          <Table.Head className={cn('min-w-[150px] w-[25%]', { 'min-w-[100px]': isSmallWidth })}>
            <Text variant="caption-strong">{t('views:labelData.table.created', 'Created in')}</Text>
          </Table.Head>
          <Table.Head className={cn('min-w-[200px] w-[40%]', { 'min-w-[150px]': isSmallWidth })}>
            <Text variant="caption-strong">{t('views:labelData.table.description', 'Description')}</Text>
          </Table.Head>
          <Table.Head className="w-[68px]" hideDivider />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {labels.map(label => (
          <Table.Row
            className="cursor-pointer"
            key={label.id}
            onClick={() => {
              if (toRepoLabelDetails) {
                toRepoLabelDetails({ labelId: label.key, scope: label.scope })
              }
            }}
          >
            <Table.Cell className="relative align-top">
              {values?.[label.key]?.length > 0 ? (
                <Button
                  variant="ghost"
                  size="2xs"
                  iconOnly
                  onClick={e => toggleRow(label.key, e)}
                  className="mt-cn-2xs absolute right-0"
                >
                  <IconV2 name={expandedRows[label.key] ? 'nav-arrow-up' : 'nav-arrow-down'} />
                </Button>
              ) : null}
            </Table.Cell>
            <Table.Cell className="align-top">
              <Layout.Vertical align="start" gap="xs">
                <Layout.Grid gap="xs" align="center" className="mt-cn-2xs grid-cols-[auto_auto]">
                  <LabelTag
                    scope={label.scope ?? 0}
                    labelKey={label.key}
                    color={label.color}
                    labelValue={(values?.[label.key]?.length || '').toString()}
                    withIndicator={label.type === LabelType.DYNAMIC}
                  />
                </Layout.Grid>

                {!!values?.[label.key]?.length &&
                  expandedRows[label.key] &&
                  values?.[label.key].map(item => (
                    <LabelTag
                      key={item.id}
                      scope={label.scope}
                      labelKey={label.key}
                      color={item?.color || label.color}
                      labelValue={item.value}
                    />
                  ))}
              </Layout.Vertical>
            </Table.Cell>
            <Table.Cell className="align-top leading-none">
              <ScopeTag
                className="mt-cn-2xs grid max-w-full grid-cols-[auto_auto]"
                scopedPath={getScopeType(label.scope)}
                scopeType={getScopeType(label.scope)}
              />
            </Table.Cell>
            <Table.Cell className="align-top">
              <Text lineClamp={2} className="mt-cn-xs">
                {label?.description || ''}
              </Text>
            </Table.Cell>
            <Table.Cell className="align-top">
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
