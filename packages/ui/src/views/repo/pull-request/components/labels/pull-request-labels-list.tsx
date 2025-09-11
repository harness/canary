import { FC } from 'react'

import { Text } from '@/components'
import { useTranslation } from '@/context'
import { LabelTag, LabelTagProps, PRListLabelType } from '@/views'
import { cn } from '@utils/cn'

type LabelListLabel = PRListLabelType &
  Omit<LabelTagProps, 'labelKey' | 'id' | 'value'> & {
    onDelete?: () => void
    value?: string
  }

interface LabelsListProps {
  labels: LabelListLabel[]
  className?: string
  showReset?: boolean
  onClick?: (label: LabelListLabel) => void
}

export const LabelsList: FC<LabelsListProps> = ({ labels, className, showReset, onClick }) => {
  const { t } = useTranslation()

  if (!labels.length) {
    return (
      <Text variant="body-strong" color="foreground-3">
        {t('views:pullRequests.noLabelsSidebar', 'No labels')}
      </Text>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {labels.map(label => (
        <LabelTag
          key={label.key}
          scope={label.scope}
          color={label.color}
          labelKey={label.key}
          value={label.value || ''}
          onActionClick={label.onDelete}
          actionIcon={showReset ? 'xmark' : undefined}
          onClick={() => onClick?.(label)}
        />
      ))}
    </div>
  )
}
