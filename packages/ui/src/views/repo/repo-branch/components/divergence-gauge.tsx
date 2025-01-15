import { Progress, Text } from '@/components'
import { cn } from '@/utils/cn'
import { TranslationStore } from '@/views'

interface GaugeProps {
  behindAhead: {
    behind?: number
    ahead?: number
  }
  className?: string
  useTranslationStore: () => TranslationStore
}

export const DivergenceGauge = ({ behindAhead, className, useTranslationStore }: GaugeProps) => {
  const { t } = useTranslationStore()
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
    <div className={cn('mt-0.5 flex w-full flex-col gap-[3px]', className)}>
      <div className="mx-auto grid w-28 grid-flow-col grid-cols-[1fr_auto_1fr] items-center justify-items-end gap-x-1.5">
        <Text size={1} truncate color="tertiaryBackground" className="leading-none">
          {behindAhead.behind ?? 0}
          <span className="sr-only">
            {t('views:repos.commits', 'commits')}
            {t('views:repos.behind', 'behind')}
          </span>
        </Text>
        <div className="h-3 w-px bg-borders-2" aria-hidden />
        <Text size={1} truncate color="tertiaryBackground" className="place-self-start leading-none">
          {behindAhead.ahead ?? 0}
          <span className="sr-only">
            {t('views:repos.commits', 'commits')}
            {t('views:repos.ahead', 'ahead')}
          </span>
        </Text>
      </div>
      {/* Both behind and ahead are 0, don't show the progress bar */}
      {behindAhead?.behind === 0 && behindAhead?.ahead == 0 ? null : (
        <div className="mx-auto grid w-28 grid-flow-col grid-cols-2 items-center justify-center">
          <Progress
            variant="divergence"
            value={adjustedBehindPercentage}
            size="sm"
            rotated="180deg"
            indicatorRounded="right-sm"
            indicatorColor="blackground-12"
          />
          <Progress
            variant="divergence"
            value={adjustedAheadPercentage}
            size="sm"
            indicatorRounded="right-sm"
            indicatorColor="blackground-13"
          />
        </div>
      )}
    </div>
  )
}
