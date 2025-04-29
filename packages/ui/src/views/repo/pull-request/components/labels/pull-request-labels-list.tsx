import { FC } from 'react'

import { LabelMarkerProps, PRListLabelType } from '@/views'
import { Tag } from '@components/tag'
import { cn } from '@utils/cn'

type LabelListLabel = PRListLabelType & Pick<LabelMarkerProps, 'onDelete'>

interface LabelsListProps {
  labels: LabelListLabel[]
  className?: string
  showReset?: boolean
}

export const LabelsList: FC<LabelsListProps> = ({ labels, className, showReset }) => {
  if (!labels.length) {
    return <span className="text-2 font-medium text-cn-foreground-3">No labels</span>
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {labels.map(label => (
        <Tag
          key={label.key}
          variant="secondary"
          size="sm"
          label={label.key}
          value={label.value || ''}
          theme={label.color}
          onReset={label.onDelete}
          showReset={showReset}
        />
      ))}
    </div>
  )
}
