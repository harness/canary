import { CSSProperties } from 'react'

import { Layout, Progress, Separator, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

interface GaugeProps {
  behindAhead: {
    behind?: number
    ahead?: number
  }
  className?: string
}

export const DivergenceGauge = ({ behindAhead, className }: GaugeProps) => {
  const { t } = useTranslation()
  const total = (behindAhead.behind ?? 0) + (behindAhead.ahead ?? 0)
  const getPercentage = (value: number) => (total > 0 ? (value / total) * 100 : 0)
  const behindPercentage = getPercentage(behindAhead.behind ?? 0)
  const aheadPercentage = getPercentage(behindAhead.ahead ?? 0)

  const adjustPercentage = (percentage: number) => {
    return percentage > 0 && percentage < 10 ? 10 : percentage
  }

  const adjustedBehindPercentage = adjustPercentage(behindPercentage)
  const adjustedAheadPercentage = adjustPercentage(aheadPercentage)

  return (
    <Layout.Grid className={cn('', className)} gapY="3xs">
      <Layout.Grid columns="1fr auto 1fr" align="center" justify="center" gapX="2xs">
        <Text variant="body-single-line-normal" align="right">
          {behindAhead.behind ?? 0}
          <span className="sr-only">{t('views:repos.branches.commitsBehind', 'commits behind')}</span>
        </Text>
        <Separator orientation="vertical" />
        <Text variant="body-single-line-normal">
          {behindAhead.ahead ?? 0}
          <span className="sr-only">{t('views:repos.branches.commitsAhead', 'commits ahead')}</span>
        </Text>
      </Layout.Grid>
      {/* Both behind and ahead are 0, don't show the progress bar */}
      {/* TODO: replace with meter component when available */}
      {behindAhead?.behind === 0 && behindAhead?.ahead == 0 ? null : (
        <Layout.Grid columns={2} align="center" justify="center" className="mx-auto w-20">
          <Progress
            className="[&_.cn-progress-root::-moz-progress-bar]:bg-cn-gray-secondary [&_.cn-progress-root::-webkit-progress-value]:bg-cn-gray-secondary rotate-180 justify-self-end [&_.cn-progress-root]:rounded-l-cn-none"
            value={adjustedBehindPercentage / 100}
            size="sm"
            hideIcon
            hidePercentage
            hideContainer
            style={{ width: `${adjustedBehindPercentage}%` } as CSSProperties}
          />
          <Progress
            className="[&_.cn-progress-root::-moz-progress-bar]:bg-cn-gray-primary [&_.cn-progress-root::-webkit-progress-value]:bg-cn-gray-primary [&_.cn-progress-root]:rounded-l-cn-none"
            value={adjustedAheadPercentage / 100}
            size="sm"
            hideIcon
            hidePercentage
            hideContainer
            style={{ width: `${adjustedAheadPercentage}%` } as CSSProperties}
          />
        </Layout.Grid>
      )}
    </Layout.Grid>
  )
}
