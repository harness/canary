import { FC, Fragment, useState } from 'react'

import {
  Button,
  getScopeType,
  IconV2,
  Layout,
  MoreActionsTooltip,
  NoData,
  ScopeTag,
  scopeTypeToIconMap,
  Table,
  Tag,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils'
import { ILabelType, LabelAddIndicator, LabelType, LabelValuesType } from '@/views'

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
        className="min-h-0"
        imageName="no-data-labels"
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
          <Table.Head className={cn('w-[260px]', { 'w-4/12': isSmallWidth })} hideDivider>
            <Text variant="caption-strong">{t('views:labelData.table.name', 'Name')}</Text>
          </Table.Head>
          <Table.Head className="w-[240px]">
            <Text variant="caption-strong">{t('views:labelData.table.created', 'Created in')}</Text>
          </Table.Head>
          <Table.Head className={cn({ 'w-5/12': isSmallWidth })}>
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
            <Table.Cell className={cn('w-[44px] align-top', { 'w-4/12': isSmallWidth })}>
              {values?.[label.key]?.length > 0 ? (
                <Button
                  variant="ghost"
                  size="2xs"
                  iconOnly
                  onClick={e => toggleRow(label.key, e)}
                  className="mt-cn-2xs"
                >
                  <IconV2 name={expandedRows[label.key] ? 'nav-arrow-up' : 'nav-arrow-down'} />
                </Button>
              ) : null}
            </Table.Cell>
            <Table.Cell className="align-top">
              <Layout.Vertical align="start" gap="xs">
                <Layout.Grid gap="xs" align="center" className="mt-cn-2xs grid-cols-[auto_auto]">
                  <Tag
                    icon={scopeTypeToIconMap[getScopeType(label.scope)]}
                    variant="secondary"
                    size="md"
                    theme={label.color}
                    label={label.key}
                    value={(values?.[label.key]?.length || '').toString()}
                    className="grid grid-cols-[auto_auto]"
                    labelClassName="grid grid-cols-[auto_auto]"
                    valueClassName="grid grid-cols-[auto]"
                  />

                  {label.type === LabelType.DYNAMIC && <LabelAddIndicator />}
                </Layout.Grid>

                {!!values?.[label.key]?.length &&
                  expandedRows[label.key] &&
                  values?.[label.key].map(item => (
                    <Tag
                      key={item.id}
                      icon={scopeTypeToIconMap[getScopeType(label.scope)]}
                      variant="secondary"
                      size="md"
                      theme={item?.color || label.color}
                      label={label.key}
                      value={item.value}
                      className="grid grid-cols-[auto_auto]"
                      labelClassName="grid grid-cols-[auto_auto]"
                      valueClassName="grid grid-cols-[auto]"
                    />
                  ))}
              </Layout.Vertical>
            </Table.Cell>
            <Table.Cell className="w-[240px] align-top leading-none">
              <ScopeTag
                className="mt-cn-2xs grid max-w-full grid-cols-[auto_auto]"
                scopedPath={getScopeType(label.scope)}
                scopeType={getScopeType(label.scope)}
              />
            </Table.Cell>
            <Table.Cell className={cn('align-top', { 'w-5/12': isSmallWidth })}>
              <Text color="foreground-3" lineClamp={2} className="mt-cn-xs">
                {label?.description || ''}
              </Text>
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
