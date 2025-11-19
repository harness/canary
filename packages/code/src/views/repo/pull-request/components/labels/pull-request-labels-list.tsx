import { FC } from 'react'

import { LabelTag, LabelTagProps, PRListLabelType } from '@/views'

import { Layout, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

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
    <Layout.Flex className={className} wrap="wrap" gap="2xs">
      {labels.map(label => (
        <LabelTag
          key={label.key}
          scope={label.scope}
          theme={label.color}
          label={label.key}
          value={label.value || ''}
          onActionClick={label.onDelete}
          actionIcon={showReset ? 'xmark' : undefined}
          onClick={() => onClick?.(label)}
        />
      ))}
    </Layout.Flex>
  )
}
