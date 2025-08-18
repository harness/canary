import { FC } from 'react'

import { getScopeType, scopeTypeToIconMap, Tag, Text } from '@/components'
import { LabelMarkerProps, PRListLabelType } from '@/views'
import { cn } from '@utils/cn'

type LabelListLabel = PRListLabelType & Pick<LabelMarkerProps, 'onDelete'>

interface LabelsListProps {
  labels: LabelListLabel[]
  className?: string
  showReset?: boolean
  onClick?: (label: LabelListLabel) => void
}

export const LabelsList: FC<LabelsListProps> = ({ labels, className, showReset, onClick }) => {
  if (!labels.length) {
    return (
      <Text variant="body-strong" color="foreground-3">
        No labels
      </Text>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {labels.map(label => (
        <Tag
          key={label.key}
          variant="secondary"
          size="sm"
          icon={scopeTypeToIconMap[getScopeType(label.scope)]}
          label={label.key}
          value={label.value || ''}
          theme={label.color}
          onActionClick={label.onDelete}
          actionIcon={showReset ? 'xmark' : undefined}
          className="grid max-w-full grid-cols-[auto_auto]"
          labelClassName="grid grid-cols-[auto_auto]"
          valueClassName="grid grid-cols-[auto_auto] content-center"
          onClick={
            onClick
              ? e => {
                  e.stopPropagation()
                  e.preventDefault()
                  onClick?.(label)
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}
