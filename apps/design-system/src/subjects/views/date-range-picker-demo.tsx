import { useState } from 'react'

import {
  DateRangePicker,
  FilterField,
  FilterFieldTypes,
  formatDateRangeLabel,
  Layout,
  parseDateRangeQuery,
  Text,
  type SemanticDateRangeValue
} from '@harnessio/ui/components'

const interpretQuery =
  (timeZone: string) =>
  async (query: string): Promise<SemanticDateRangeValue> => {
    await Promise.resolve()
    return parseDateRangeQuery(query, { timeZone })
  }

const DateRangePickerDemo = () => {
  const [value, setValue] = useState<SemanticDateRangeValue | undefined>()
  const [filterValue, setFilterValue] = useState<SemanticDateRangeValue | undefined>({
    kind: 'calendar',
    period: 'next_month',
    timeZone: 'America/New_York'
  })
  const timeZone = value?.timeZone ?? 'UTC'

  return (
    <Layout.Flex direction="column" gapY="xl" className="mx-auto max-w-[1120px] p-cn-xl">
      <div className="flex items-start justify-between gap-cn-lg">
        <Layout.Flex direction="column" gapY="xs">
          <Text variant="heading-section">Service health overview</Text>
          <Text variant="body-normal" color="foreground-3">
            Monitor deployments, reliability, and request volume across the Platform.
          </Text>
        </Layout.Flex>
        <Text variant="caption-normal" color="foreground-3">
          Updated just now
        </Text>
      </div>

      <section className="border-cn-2 rounded-cn-4 border bg-cn-1">
        <div className="border-cn-2 flex items-center justify-start gap-cn-md border-b p-cn-md">
          <DateRangePicker
            value={value}
            onChange={setValue}
            enableOffset
            enableExclusions
            onInterpretQuery={interpretQuery(timeZone)}
          />
        </div>

        <div className="grid grid-cols-3 gap-cn-md p-cn-lg">
          {[
            ['Requests', '1.84M', '+12.4%'],
            ['Success rate', '99.96%', '+0.08%'],
            ['P95 latency', '248 ms', '-18 ms']
          ].map(([label, metric, change]) => (
            <div key={label} className="border-cn-2 rounded-cn-3 border bg-cn-2 p-cn-md">
              <Text variant="caption-normal" color="foreground-3">
                {label}
              </Text>
              <Text variant="heading-subsection" className="mt-cn-xs">
                {metric}
              </Text>
              <Text variant="caption-strong" color="success" className="mt-cn-xs block">
                {change}
              </Text>
            </div>
          ))}
        </div>

        <div className="px-cn-lg pb-cn-lg">
          <div className="border-cn-2 relative h-52 overflow-hidden rounded-cn-3 border bg-cn-2">
            <div className="border-cn-2 absolute inset-x-0 top-1/4 border-t" />
            <div className="border-cn-2 absolute inset-x-0 top-1/2 border-t" />
            <div className="border-cn-2 absolute inset-x-0 top-3/4 border-t" />
            <div className="absolute inset-x-cn-lg bottom-cn-lg h-20 rounded-t-[60%] bg-cn-brand-primary/10" />
            <div className="absolute inset-x-cn-lg bottom-[52px] border-t-2 border-cn-brand-primary" />
          </div>
        </div>
      </section>

      <Layout.Flex direction="column" gapY="2xs">
        <Text variant="caption-strong">Applied range</Text>
        <Text variant="caption-normal" color="foreground-3">
          {value
            ? formatDateRangeLabel(value, { includeResolvedRange: true, includeTimeZone: true })
            : 'No range selected'}
        </Text>
      </Layout.Flex>

      <section className="border-cn-2 rounded-cn-4 border bg-cn-1 p-cn-lg">
        <Layout.Flex direction="column" gapY="md">
          <Layout.Flex direction="column" gapY="2xs">
            <Text variant="body-strong">Filter field specimen</Text>
            <Text variant="caption-normal" color="foreground-3">
              The filter integration uses the same semantic value and picker content.
            </Text>
          </Layout.Flex>

          <div className="w-fit">
            <FilterField
              filterOption={{
                type: FilterFieldTypes.DateRange,
                label: 'Timeframe',
                value: 'timeframe',
                filterFieldConfig: {
                  defaultTimeZone: 'UTC',
                  allowFuture: true,
                  enableOffset: true,
                  enableExclusions: true
                }
              }}
              removeFilter={() => setFilterValue(undefined)}
              shouldOpenFilter={false}
              onChange={setFilterValue}
              value={filterValue}
            />
          </div>
        </Layout.Flex>
      </section>
    </Layout.Flex>
  )
}

export default DateRangePickerDemo
