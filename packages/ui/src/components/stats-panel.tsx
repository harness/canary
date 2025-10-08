import { FC } from 'react'

import { Layout, Skeleton, Text } from '@/components'

export interface StatsPanelProps {
  data: { label: string; value?: JSX.Element }[]
  isLoading?: boolean
}

export const StatsPanel: FC<StatsPanelProps> = ({ data, isLoading = false }) => {
  if (!data.length) return null

  return (
    <Layout.Flex wrap="wrap" gap="3xl">
      {data.map((stat, index) => (
        <Layout.Vertical gap="sm" key={index}>
          <Text color="foreground-3">{stat.label}</Text>
          {isLoading ? (
            <Skeleton.Typography className="w-16" />
          ) : (
            <Text as="div" color="foreground-1">
              {stat?.value ? stat.value : '-'}
            </Text>
          )}
        </Layout.Vertical>
      ))}
    </Layout.Flex>
  )
}
