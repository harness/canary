import { FC } from 'react'

import { LabelMarker } from '@/components'
import { PRListLabelType } from '@/views'
import { cn } from '@utils/cn'

interface LabelsListProps {
  labels: PRListLabelType[]
  className?: string
}

const LabelsList: FC<LabelsListProps> = ({ labels, className }) => {
  if (!labels.length) {
    return <span className="text-14 font-medium text-foreground-5">No labels</span>
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5 pl-[22px]', className)}>
      {labels.map(label => (
        <LabelMarker key={label.key} color={label.color} label={label.key} value={label?.value} />
      ))}
    </div>
  )
}

export { LabelsList }
