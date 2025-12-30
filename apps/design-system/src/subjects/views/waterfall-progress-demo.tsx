import { useEffect, useState } from 'react'

import { Button, Layout, Text, WaterfallProgress } from '@harnessio/ui/components'

const WaterfallProgressDemo = () => {
  const [value, setValue] = useState(50)
  const [startOffset, setStartOffset] = useState(10)
  const [inProgress, setInProgress] = useState(false)
  const [segmentValue, setSegmentValue] = useState(0)
  const [segmentKey, setSegmentKey] = useState(0)

  const StageTooltip = ({
    label,
    durationMs,
    start = '0:00',
    end = '0:10',
    range = '0% - 10%'
  }: {
    label: string
    durationMs: number
    start?: string
    end?: string
    range?: string
  }) => (
    <div className="min-w-[260px] grid gap-cn-sm">
      <div className="flex items-center gap-cn-xs">
        <span className="size-2 rounded-cn-full bg-cn-success-primary" />
        <Text variant="body-strong">{label}</Text>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-x-cn-md gap-y-cn-2xs">
        <Text color="foreground-3">Duration</Text>
        <Text>{durationMs.toLocaleString()}ms</Text>
        <Text color="foreground-3">Start Time</Text>
        <Text>{start}</Text>
        <Text color="foreground-3">End Time</Text>
        <Text>{end}</Text>
        <Text color="foreground-3">Timeline Position</Text>
        <Text>{range}</Text>
      </div>
    </div>
  )

  // Helper: reliably trigger a width transition by ensuring the browser
  // applies width: 0% first, then grows to 10% on the next frame.
  const playSegmentAnimation = () => {
    // Remount the segment example to reset any prior transitions
    setSegmentKey(k => k + 1)
    setSegmentValue(0)
    // Use double-rAF to guarantee a paint with width: 0% before expanding
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSegmentValue(10)
      })
    })
  }

  // Animate the segment anchored at 45% from 0% → 10% width on mount
  useEffect(() => {
    playSegmentAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout.Flex direction="column" gapY="lg" className="p-cn-xl max-w-[720px]">
      <Text variant="heading-section">WaterfallProgress Demo</Text>

      <Layout.Flex direction="column" gapY="sm">
        <Text variant="body-strong">Basic</Text>
        <WaterfallProgress className="w-full" value={value} startOffset={startOffset} label="Basic" />
      </Layout.Flex>

      <Layout.Flex direction="column" gapY="sm">
        <Text variant="body-strong">Clamping (startOffset=90, value=50 → 90%→100%)</Text>
        <WaterfallProgress className="w-full" value={50} startOffset={90} theme="warning" label="Clamped" />
      </Layout.Flex>

      <Layout.Flex direction="column" gapY="sm">
        <Text variant="body-strong">Empty states</Text>
        <WaterfallProgress className="w-full" value={0} startOffset={20} theme="muted" label="Value 0 (empty)" />
        <WaterfallProgress className="w-full" value={40} startOffset={100} theme="muted" label="Offset 100 (empty)" />
      </Layout.Flex>

      <Layout.Flex direction="column" gapY="sm">
        <Text variant="body-strong">In Progress + Tooltip</Text>
        <WaterfallProgress
          className="w-full"
          value={30}
          startOffset={20}
          inProgress
          theme="info"
          label="Processing"
          tooltipContent={<div className="max-w-[240px]">Task is running, ETA around 2m</div>}
        />
      </Layout.Flex>

      <Layout.Flex direction="column" gapY="sm">
        <Text variant="body-strong">Interactive</Text>
        <Layout.Flex gapX="sm">
          <Button size="sm" onClick={() => setValue(v => Math.max(v - 10, 0))}>
            -10 value
          </Button>
          <Button size="sm" onClick={() => setValue(v => Math.min(v + 10, 120))}>
            +10 value
          </Button>
          <Button size="sm" onClick={() => setStartOffset(s => Math.max(s - 10, 0))}>
            -10 offset
          </Button>
          <Button size="sm" onClick={() => setStartOffset(s => Math.min(s + 10, 120))}>
            +10 offset
          </Button>
          <Button size="sm" variant={inProgress ? 'outline' : 'primary'} onClick={() => setInProgress(p => !p)}>
            Toggle inProgress
          </Button>
        </Layout.Flex>
        <WaterfallProgress
          className="w-full"
          value={value}
          startOffset={startOffset}
          inProgress={inProgress}
          theme="success"
          label={`Interactive (${startOffset} + ${value})`}
          tooltipContent={
            <div>
              <div>startOffset: {startOffset}</div>
              <div>value: {value}</div>
            </div>
          }
        />

        <Layout.Flex gapX="sm" align="center">
          <Button size="sm" onClick={playSegmentAnimation}>
            Replay 45%→55%
          </Button>
          <Text color="foreground-3">Smoothly reveals segment anchored at 45%</Text>
        </Layout.Flex>
        <WaterfallProgress
          key={segmentKey}
          className="w-full"
          value={segmentValue}
          startOffset={45}
          theme="warning"
          label="Animated segment (45% → 55%)"
          tooltipContent={<StageTooltip label="Pre-deployment" durationMs={10000} range="45% - 55%" />}
          tooltipProps={{
            side: 'bottom',
            align: 'center',
            onOpenAutoFocus: e => e.preventDefault()
          }}
        />
      </Layout.Flex>
    </Layout.Flex>
  )
}

export default WaterfallProgressDemo
