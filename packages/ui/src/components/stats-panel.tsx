import { FC, ReactNode } from 'react'

import { Layout, Text } from '@/components'

export interface StatsPanelProps {
  data: { label: string; value: ReactNode }[]
}

export const StatsPanel: FC<StatsPanelProps> = ({ data }) => {
  if (!data.length) return null

  return (
    <Layout.Flex wrap="wrap" gap="md" className="gap-x-[var(--cn-spacing-11)]">
      {data.map((stat, index) => (
        <Layout.Vertical gap="xs" key={index}>
          <Text variant="body-single-line-normal" color="foreground-3">
            {stat.label}
          </Text>
          <Text as="div" variant="body-single-line-normal" color="foreground-1">
            {stat.value ? stat.value : '-'}
          </Text>
        </Layout.Vertical>
      ))}
    </Layout.Flex>
  )
}
