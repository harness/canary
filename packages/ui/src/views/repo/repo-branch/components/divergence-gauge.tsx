import { Progress } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@/utils/cn'

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
    <div className={cn('flex w-full flex-col gap-[4px]', className)}>
      <div className="mx-auto grid w-28 grid-flow-col grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-1.5">
        <span className="truncate text-right text-2 leading-none text-cn-foreground-3">
          {behindAhead.behind ?? 0}
          <span className="sr-only">
            {t('views:repos.commits', 'commits')}
            {t('views:repos.behind', 'behind')}
          </span>
        </span>
        <div className="h-[1.125rem] w-px bg-cn-borders-3" aria-hidden />
        <span className="truncate text-2 leading-none text-cn-foreground-3">
          {behindAhead.ahead ?? 0}
          <span className="sr-only">
            {t('views:repos.commits', 'commits')}
            {t('views:repos.ahead', 'ahead')}
          </span>
        </span>
      </div>
      {/* Both behind and ahead are 0, don't show the progress bar */}
      {/* TODO: replace with meter component when available */}
      {behindAhead?.behind === 0 && behindAhead?.ahead == 0 ? null : (
        <div className="mx-auto w-28 flex items-center justify-center">
          <div className="flex flex-row-reverse w-1/2 justify-start">
            <div style={{ width: `${adjustedBehindPercentage}%` }}>
              <Progress
                className={`rotate-180 [&_.cn-progress-root]:rounded-l-none [&_.cn-progress-root::-webkit-progress-value]:bg-cn-background-8 [&_.cn-progress-root::-moz-progress-bar]:bg-cn-background-8`}
                value={adjustedBehindPercentage / 100}
                size="sm"
                hideIcon
                hidePercentage
                hideContainer
              />
            </div>
          </div>
          <div className="flex w-1/2 justify-start">
            <div style={{ width: `${adjustedAheadPercentage}%` }}>
              <Progress
                className={`[&_.cn-progress-root]:rounded-l-none [&_.cn-progress-root::-webkit-progress-value]:bg-cn-background-13 [&_.cn-progress-root::-moz-progress-bar]:bg-cn-background-13`}
                value={adjustedAheadPercentage / 100}
                size="sm"
                hideIcon
                hidePercentage
                hideContainer
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
