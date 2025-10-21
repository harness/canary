import { isValidElement, ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react'

import { Layout, Separator, Skeleton, Text } from '@/components'
import { useResizeObserver } from '@/hooks'
import { cn, wrapConditionalObjectElement } from '@/utils'

export type ViewOnlyItemData = { label: string; value: ReactNode } | ReactNode

function splitArray<T>(array: T[]): [T[], T[]] {
  if (array.length <= 2) {
    return [array, []]
  }

  const midPoint = Math.ceil(array.length / 2)
  const firstHalf = array.slice(0, midPoint)
  const secondHalf = array.slice(midPoint)

  return [firstHalf, secondHalf]
}

export const ViewOnlyItem = ({
  label,
  value,
  isLoading = false
}: {
  label: string
  value: ReactNode
  isLoading?: boolean
}) => {
  const valueNode = !value ? (
    <Text as="span" color="disabled">
      empty
    </Text>
  ) : typeof value === 'string' ? (
    <Text key="label" color="inherit" className="break-words">
      {value}
    </Text>
  ) : (
    value
  )

  return (
    <Layout.Grid key={label} flow="row" gapX="2xl" columns="minmax(0, 200px) minmax(0, 1fr)" align="start">
      {isLoading ? (
        <>
          <Skeleton.Typography className="w-full" />
          <Skeleton.Typography className="w-2/3" />
        </>
      ) : (
        <>
          <Text color="foreground-3" as="dt">
            {label}
          </Text>
          <Text color="foreground-1" as="dd">
            {valueNode}
          </Text>
        </>
      )}
    </Layout.Grid>
  )
}

const isWideEnoughForColumns = (width: number) => width >= 800

export interface ViewOnlyProps {
  title?: string
  data: ViewOnlyItemData[]
  layout?: 'singleColumn' | 'columns'
  className?: string
  isLoading?: boolean
}

export const ViewOnly = ({ className, title, data, layout = 'columns', isLoading = false }: ViewOnlyProps) => {
  const [isLayoutColumns, setIsLayoutColumns] = useState(layout === 'columns')
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return

    const { offsetWidth } = el
    setIsLayoutColumns(isWideEnoughForColumns(offsetWidth) && layout === 'columns')
  }, [layout])

  useResizeObserver(
    contentRef,
    el => {
      if (!el || layout === 'singleColumn') return

      const { offsetWidth } = el
      setIsLayoutColumns(isWideEnoughForColumns(offsetWidth))
    },
    200
  )

  const renderItem = useCallback(
    (item: ViewOnlyItemData) => {
      if (item instanceof Object && 'label' in item && 'value' in item && typeof item.label === 'string') {
        return <ViewOnlyItem key={item.label} label={item.label} value={item.value} isLoading={isLoading} />
      } else if (isValidElement(item)) {
        return item
      }

      return null
    },
    [isLoading]
  )

  if (!data || data.length === 0) return null

  const isSeparatorVisible = isLayoutColumns && data.length > 2
  const leftColumnData = isLayoutColumns ? splitArray(data)[0] : data
  const rightColumnData = isLayoutColumns ? splitArray(data)[1] : null

  return (
    <Layout.Grid ref={contentRef} gap="md" className={cn('group', className)}>
      <Text variant="heading-base" as="h4">
        {title}
      </Text>

      <Layout.Grid
        as="dl"
        flow="column"
        align="start"
        gapX="lg"
        {...wrapConditionalObjectElement({ columns: '1fr auto 1fr' }, isLayoutColumns)}
      >
        <Layout.Grid gapY="sm">{leftColumnData.map(item => renderItem(item))}</Layout.Grid>

        {isLayoutColumns && <Separator orientation="vertical" className={cn({ invisible: !isSeparatorVisible })} />}

        {!!rightColumnData && <Layout.Grid gapY="sm">{rightColumnData.map(item => renderItem(item))}</Layout.Grid>}
      </Layout.Grid>

      <Separator className="group-last:hidden mb-cn-md" />
    </Layout.Grid>
  )
}
