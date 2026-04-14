import { FC, useMemo } from 'react'

import { Layout, Text, Tooltip } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { getLanguageColor } from '../../constants/language-colors'

export interface LanguageStat {
  name: string
  percentage: number
}

interface LanguageBarProps {
  languages: LanguageStat[]
}

const MAX_LEGEND_ITEMS = 6

const formatPercentage = (pct: number): string => {
  if (pct > 0 && pct < 0.1) return '< 0.1'
  return pct.toFixed(1)
}

export const LanguageBar: FC<LanguageBarProps> = ({ languages }) => {
  const { t } = useTranslation()

  const sorted = useMemo(() => [...languages].sort((a, b) => b.percentage - a.percentage), [languages])

  if (!sorted.length) return null

  const legendItems = sorted.slice(0, MAX_LEGEND_ITEMS)
  const otherPercent = sorted.slice(MAX_LEGEND_ITEMS).reduce((sum, l) => sum + l.percentage, 0)

  return (
    <Layout.Vertical gap="sm">
      <Text variant="heading-base" as="h5">
        {t('views:repos.languages', 'Languages')}
      </Text>

      <Layout.Horizontal gap="3xs" className="rounded-cn-full overflow-hidden">
        {sorted.map(lang => (
          <Tooltip key={lang.name} content={`${lang.name} ${formatPercentage(lang.percentage)}%`}>
            <div
              className="rounded-cn-full h-2"
              style={{
                backgroundColor: getLanguageColor(lang.name),
                width: `clamp(4px, ${lang.percentage}%, 100%)`
              }}
            />
          </Tooltip>
        ))}
      </Layout.Horizontal>

      <Layout.Flex gap="md" wrap="wrap">
        {legendItems.map(lang => (
          <Layout.Horizontal key={lang.name} gap="2xs" align="center">
            <div className="rounded-cn-full size-2 shrink-0" style={{ backgroundColor: getLanguageColor(lang.name) }} />
            <Text variant="caption-single-line-normal" color="foreground-2">
              {lang.name}
            </Text>
            <Text variant="caption-single-line-normal" color="foreground-4">
              {formatPercentage(lang.percentage)}%
            </Text>
          </Layout.Horizontal>
        ))}
        {otherPercent > 0 && (
          <Layout.Horizontal gap="2xs" align="center">
            <div className="rounded-cn-full bg-cn-3 size-2 shrink-0" />
            <Text variant="caption-single-line-normal" color="foreground-2">
              {t('views:repos.otherLanguages', 'Other')}
            </Text>
            <Text variant="caption-single-line-normal" color="foreground-4">
              {formatPercentage(otherPercent)}%
            </Text>
          </Layout.Horizontal>
        )}
      </Layout.Flex>
    </Layout.Vertical>
  )
}
