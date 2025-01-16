import { NoData, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@/components'

import { LabelsListViewProps } from '../types'
import { LabelToolTip } from './label-tool-tip'

export const LabelsListView: React.FC<LabelsListViewProps> = ({
  labels,
  // createdIn,
  handleEditLabel,
  handleDeleteLabel,
  useTranslationStore,
  searchQuery,
  handleResetSearch,
  openCreateLabelDialog,
  values,
  useLabelsStore
}) => {
  const { t } = useTranslationStore()
  const { space_ref, repo_ref } = useLabelsStore!()

  if (!labels?.length) {
    if (searchQuery) {
      return (
        <NoData
          iconName="no-search-magnifying-glass"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          primaryButton={{
            label: t('views:noData.clearSearch', 'Clear search'),
            onClick: handleResetSearch
          }}
        />
      )
    }

    return (
      <NoData
        iconName="no-data-branches"
        title={t('views:noData.labels', 'No labels yet')}
        description={[t('views:noData.createLabel', 'Create a new label to get started.')]}
        primaryButton={{
          label: t('views:projectSettings.newLabels', 'Create label'),
          onClick: openCreateLabelDialog
        }}
      />
    )
  }

  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created In</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Values</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labels &&
          labels.length > 0 &&
          labels.map(label => (
            <TableRow key={label.key}>
              <TableCell className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded-full" style={{ backgroundColor: label.color }}></div>
                  {label.key}
                </div>
              </TableCell>
              <TableCell className="content-center">
                {label.scope === 0 ? <Text>{repo_ref}</Text> : <Text>{space_ref}</Text>}
              </TableCell>
              <TableCell className="content-center">{label.description}</TableCell>
              <TableCell className="content-center">
                {values[label.key]?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {values[label.key].map(val => (
                      <span
                        key={val.value}
                        className="rounded border px-2"
                        style={{
                          borderColor: val.color,
                          color: val.color
                        }}
                      >
                        {val.value}
                      </span>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell className="flex justify-end">
                <LabelToolTip onEdit={handleEditLabel} onDelete={handleDeleteLabel} identifier={label.key} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
