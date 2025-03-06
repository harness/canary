import { FC } from 'react'

import { LabelMarker, LabelMarkerProps, PRListLabelType } from '@/views'
import { cn } from '@utils/cn'

type LabelListLabel = PRListLabelType & Pick<LabelMarkerProps, 'onDelete'>

interface LabelsListProps {
  labels: LabelListLabel[]
  className?: string
}

export const LabelsList: FC<LabelsListProps> = ({ labels, className }) => {
  if (!labels.length) {
    return <span className="text-14 font-medium text-foreground-5">No labels</span>
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {labels.map(label => (
        <LabelMarker
          key={label.key}
          color={label.color}
          label={label.key}
          value={label?.value}
          onDelete={label.onDelete}
        />
      ))}
    </div>
  )
}
