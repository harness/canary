import { FC, Fragment, useState } from 'react'

import { Button, IconV2, Layout, MoreActionsTooltip, NoData, ScopeTag, Table, Tag, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { ILabelType, LabelValuesType, ScopeType } from '@/views'

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

const getScopeType = (scope: number): ScopeType => {
  switch (scope) {
    case 0:
      return ScopeType.Repository
    case 1:
      return ScopeType.Account
    case 2:
      return ScopeType.Organization
    case 3:
      return ScopeType.Project
    default:
      return ScopeType.Account
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
          className="py-cn-xl min-h-0"
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
        className="py-cn-3xl min-h-0"
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
    <Table.Root tableClassName="table-fixed" size="compact">
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[44px]" />
          <Table.Head className={cn('w-[260px]', { 'w-4/12': isSmallWidth })}>
            <Text variant="caption-strong">{t('views:labelData.table.name', 'Name')}</Text>
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
          <Table.Row
            className="cursor-pointer"
            key={label.id}
            onClick={() => {
              if (toRepoLabelDetails) {
                toRepoLabelDetails({ labelId: label.key, scope: label.scope })
              }
            }}
          >
            <Table.Cell className={cn('w-[44px] align-top', { 'w-4/12': isSmallWidth })}>
              {values?.[label.key]?.length > 0 ? (
                <Button variant="ghost" size="2xs" iconOnly onClick={e => toggleRow(label.key, e)}>
                  <IconV2 name={expandedRows[label.key] ? 'nav-arrow-up' : 'nav-arrow-down'} />
                </Button>
              ) : null}
            </Table.Cell>
            <Table.Cell className="w-[260px] align-top">
              <Layout.Vertical align="start" gap={values?.[label.key]?.length ? 'xs' : 'none'}>
                <Tag
                  variant="secondary"
                  size="md"
                  theme={label.color}
                  label={label.key}
                  value={(values?.[label.key]?.length || '').toString()}
                />
                <Layout.Vertical gap="xs">
                  {!!values?.[label.key]?.length &&
                    expandedRows[label.key] &&
                    values?.[label.key].map(item => (
                      <Tag
                        key={item.id}
                        variant="secondary"
                        size="md"
                        theme={item?.color || label.color}
                        label={label.key}
                        value={item.value}
                      />
                    ))}
                </Layout.Vertical>
              </Layout.Vertical>
            </Table.Cell>
            <Table.Cell className="w-[240px] align-top leading-none">
              <ScopeTag scopedPath={getScopeType(label.scope)} scopeType={getScopeType(label.scope)} />
            </Table.Cell>
            <Table.Cell className={cn('w-[298px] align-top', { 'w-5/12': isSmallWidth })}>
              <span className="line-clamp-3 break-words text-sm text-cn-foreground-3">{label?.description || ''}</span>
            </Table.Cell>
            <Table.Cell className="w-[68px] align-top">
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
