import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from '@/components'

import { LabelsListViewProps } from '../types'
import { LabelToolTip } from './label-tool-tip'

export const LabelsListView: React.FC<LabelsListViewProps> = ({
  labels,
  createdIn,
  handleEditLabel,
  handleDeleteLabel,
  useTranslationStore
}) => {
  const { t: _t } = useTranslationStore()
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created In</TableHead>
          <TableHead>Description</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labels && labels.length > 0 ? (
          labels.map(label => (
            <TableRow key={label.key}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded-full" style={{ backgroundColor: label.color }}></div>
                  {label.key}
                </div>
              </TableCell>
              <TableCell>{createdIn}</TableCell>
              <TableCell>{label.description}</TableCell>
              <TableCell className="flex justify-end">
                <LabelToolTip onEdit={handleEditLabel} onDelete={handleDeleteLabel} identifier={label.key} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              <Text as="p" size={2} align="center" color={'tertiaryBackground'} className="w-full text-center">
                There are no labels in this project yet. Create a new label to get started.
              </Text>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
