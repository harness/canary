import { FC } from 'react'

import { Layout, Skeleton, Text } from '@/components'

type GapSize = 'none' | '4xs' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export interface StatsPanelProps {
  data: { label: string; value?: JSX.Element }[]
  isLoading?: boolean
  gap?: GapSize
}

export const StatsPanel: FC<StatsPanelProps> = ({ data, isLoading = false, gap = '3xs' }) => {
  if (!data.length) return null

  return (
    <Layout.Flex wrap="wrap" gap="3xl">
      {data.map((stat, index) => (
        <Layout.Vertical gap={gap} key={index}>
          <Text color="foreground-3">{stat.label}</Text>
          {isLoading ? (
            <Skeleton.Typography className="w-16" />
          ) : (
            // Fixed min-h ensures consistent StatsPanel height across pages regardless of value content (text vs badge vs icon)
            <Text as="div" color="foreground-1" className="flex min-h-[var(--cn-size-5)] items-center">
              {stat?.value ? stat.value : '-'}
            </Text>
          )}
        </Layout.Vertical>
      ))}
    </Layout.Flex>
  )
}
