import { FC } from 'react'

import { LabelMarker } from '@/components'
import { LabelAssignmentType } from '@/views'

interface LabelsListProps {
  labels: LabelAssignmentType[]
}

const LabelsList: FC<LabelsListProps> = ({ labels }) => {
  if (!labels.length) {
    return <span className="text-14 font-medium text-foreground-5">No labels</span>
  }

  return (
    <div className="flex gap-1.5">
      {labels.map(label => (
        <LabelMarker
          key={label.id}
          color={label?.assigned_value?.color || label.color}
          label={label.key}
          value={label?.assigned_value?.value || undefined}
        />
      ))}
    </div>
  )
}

export { LabelsList }
