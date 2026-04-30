import { FC } from 'react'

import { Button, Checkbox, IconV2, Layout, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { AicrCriterion } from '../repo-aicr-settings.types'

export interface RepoAicrSuccessCriteriaListProps {
  criteria: AicrCriterion[]
  disabled?: boolean
  onToggleCriterion: (identifier: string, enabled: boolean) => void
  onDeleteCriterion: (identifier: string) => void
}

export const RepoAicrSuccessCriteriaList: FC<RepoAicrSuccessCriteriaListProps> = ({
  criteria,
  disabled,
  onToggleCriterion,
  onDeleteCriterion
}) => {
  const { t } = useTranslation()

  if (!criteria.length) {
    return (
      <Text color="foreground-3" variant="body-normal">
        {t(
          'views:aicrSettings.successCriteria.empty',
          'No checks configured yet. Add a check below to start enforcing review criteria.'
        )}
      </Text>
    )
  }

  return (
    <Layout.Vertical gap="xs">
      {criteria.map(criterion => (
        <Layout.Flex
          key={criterion.identifier}
          align="start"
          justify="between"
          gapX="sm"
          className="rounded-cn-md border border-cn-2 p-cn-md"
        >
          <Layout.Flex align="start" gapX="sm" className="min-w-0 flex-1">
            <Checkbox
              id={`aicr-criterion-${criterion.identifier}`}
              checked={criterion.enabled}
              disabled={disabled}
              onCheckedChange={checked => onToggleCriterion(criterion.identifier, !!checked)}
            />
            <Layout.Vertical gap="3xs" className="min-w-0">
              <Text variant="body-strong" color="foreground-1" truncate>
                {criterion.display}
              </Text>
              {criterion.prompt && (
                <Text variant="body-normal" color="foreground-3">
                  {criterion.prompt}
                </Text>
              )}
            </Layout.Vertical>
          </Layout.Flex>

          <Button
            iconOnly
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onDeleteCriterion(criterion.identifier)}
            tooltipProps={{ content: t('views:aicrSettings.successCriteria.deleteCheck', 'Delete check') }}
          >
            <IconV2 name="trash" size="sm" />
          </Button>
        </Layout.Flex>
      ))}
    </Layout.Vertical>
  )
}
