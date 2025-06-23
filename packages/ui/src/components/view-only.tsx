import { ReactNode } from 'react'

import { cn } from '@utils/cn'

import { Layout } from './layout'
import { Separator } from './separator'
import { Text } from './text'

export interface ViewOnlyProps {
  title?: string
  data: { label: string; value: ReactNode }[]
  layout?: 'default' | 'columns'
  className?: string
}

export const ViewOnly = ({ className, title, data, layout = 'default' }: ViewOnlyProps) => {
  if (!data || data.length === 0) return null

  const withSeparator = layout === 'columns' && data.length > 2

  return (
    <Layout.Grid gap="md" className={className}>
      <Text variant="heading-base" color="foreground-1" as="h4">
        {title}
      </Text>

      <dl className={cn('grid gap-y-3.5', { 'grid-flow-col grid-cols-[1fr,auto,1fr]': withSeparator })}>
        {data.map(({ label, value }) => (
          <Layout.Grid key={label} flow="row" gapX="xl" columns="minmax(0, 200px) minmax(0, 320px)" align="start">
            <Text color="foreground-3" as="dt">
              {label}
            </Text>
            <Text color="foreground-1" as="dd">
              {typeof value === 'string' ? <Text key="label">{value}</Text> : value}
            </Text>
          </Layout.Grid>
        ))}

        {withSeparator && (
          <Separator
            orientation="vertical"
            className={cn('ml-4 mr-5')}
            style={{ gridArea: `1 / 2 / ${Math.ceil(data.length / 2) + 1} / 2` }}
          />
        )}
      </dl>
    </Layout.Grid>
  )
}
