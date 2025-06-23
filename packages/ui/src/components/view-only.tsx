import { ReactNode } from 'react'

import { cn } from '@utils/cn'

import { Layout } from './layout'
import { Separator } from './separator'
import { Spacer } from './spacer'
import { Text } from './text'

function splitArray<T>(array: T[]): [T[], T[]] {
  if (array.length <= 2) {
    return [array, []]
  }

  const midPoint = Math.ceil(array.length / 2)
  const firstHalf = array.slice(0, midPoint)
  const secondHalf = array.slice(midPoint)

  return [firstHalf, secondHalf]
}

const ViewOnlyItem = ({ label, value }: { label: string; value: ReactNode }) => (
  <Layout.Grid key={label} flow="row" gapX="xl" columns="minmax(0, 200px) minmax(0, 320px)" align="start">
    <Text color="foreground-3" as="dt">
      {label}
    </Text>
    <Text color="foreground-1" as="dd">
      {typeof value === 'string' ? <Text key="label">{value}</Text> : value}
    </Text>
  </Layout.Grid>
)

export interface ViewOnlyProps {
  title?: string
  data: { label: string; value: ReactNode }[]
  layout?: 'singleColumn' | 'columns'
  className?: string
}

export const ViewOnly = ({ className, title, data, layout = 'columns' }: ViewOnlyProps) => {
  if (!data || data.length === 0) return null

  const leftColumnData = layout === 'columns' ? splitArray(data)[0] : data
  const rightColumnData = layout === 'columns' ? splitArray(data)[1] : null

  const withSeparator = layout === 'columns' && data.length > 2

  return (
    <Layout.Grid className={cn('group', className)}>
      <Text variant="heading-base" color="foreground-1" as="h4" className="mb-4">
        {title}
      </Text>

      <Layout.Grid as="dl" flow="column" columns="1fr auto 1fr" align="start">
        <Layout.Grid className="gap-y-3.5">
          {leftColumnData.map(({ label, value }) => (
            <ViewOnlyItem key={label} label={label} value={value} />
          ))}
        </Layout.Grid>

        <Separator orientation="vertical" className={cn('ml-4 mr-5', { invisible: !withSeparator })} />

        {!!rightColumnData && (
          <Layout.Grid className="gap-y-3.5">
            {rightColumnData.map(({ label, value }) => (
              <ViewOnlyItem key={label} label={label} value={value} />
            ))}
          </Layout.Grid>
        )}
      </Layout.Grid>

      <div className="group-last:hidden">
        <Spacer size={5} />
        <Separator />
        <Spacer size={5} />
      </div>
    </Layout.Grid>
  )
}
