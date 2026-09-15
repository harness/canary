import { Gauge, Layout, Popover, Text } from '@harnessio/ui/components'

const GaugeDemo = () => {
  return (
    <Layout.Flex direction="column" gapY="xl" className="p-cn-xl max-w-[960px]">
      <Text variant="heading-section">Gauge Demo</Text>

      <Layout.Flex direction="column" gapY="md">
        <Text variant="body-strong">Sizes</Text>
        <Layout.Flex gapX="lg" wrap="wrap" align="end">
          <Gauge size="3xs" value={65} label="Score" showValue={false} />
          <Gauge size="2xs" value={65} label="Score" />
          <Gauge size="xs" value={65} label="Score" />
          <Gauge size="sm" value={65} label="Score" />
          <Gauge size="md" value={65} label="Score" />
          <Gauge size="lg" value={65} label="Score" />
        </Layout.Flex>
      </Layout.Flex>

      <Layout.Flex direction="column" gapY="md">
        <Text variant="body-strong">Status (auto)</Text>
        <Layout.Flex gapX="lg" wrap="wrap">
          <Gauge size="md" value={15} label="Score" />
          <Gauge size="md" value={65} label="Score" />
          <Gauge size="md" value={85} label="Score" />
        </Layout.Flex>
      </Layout.Flex>

      <Layout.Flex direction="column" gapY="md">
        <Text variant="body-strong">Value formats</Text>
        <Layout.Flex gapX="lg" wrap="wrap">
          <Gauge size="lg" value={85} label="Percent" />
          <Gauge size="lg" value={1.5} max={10} valueFormat="fraction" precision={1} label="Fraction" />
          <Gauge size="lg" value={72} valueFormat="score" label="Score" />
        </Layout.Flex>
      </Layout.Flex>

      <Layout.Flex direction="column" gapY="md">
        <Text variant="body-strong">Explicit status and custom description</Text>
        <Layout.Flex gapX="lg" wrap="wrap">
          <Gauge size="md" value={50} status="poor" label="Forced poor" />
          <Gauge size="md" value={15} status="none" label="Neutral" />
          <Gauge
            size="md"
            value={40}
            thresholds={{ poor: 50, fair: 80 }}
            statusLabelMap={{ poor: 'At risk', fair: 'Watch', good: 'Healthy' }}
            label="Custom"
          />
          <Gauge
            size="md"
            value={65}
            label="Popover"
            description={
              <Popover
                triggerType="click"
                title="Details"
                side="top"
                align="center"
                content={
                  <Layout.Flex direction="column" gapY="2xs" className="p-cn-xs">
                    <Text variant="caption-normal">Open issues: 4</Text>
                    <Text variant="caption-normal">Fixed this week: 2</Text>
                  </Layout.Flex>
                }
              >
                <button type="button" className="underline decoration-dotted underline-offset-2">
                  <Text variant="caption-normal" color="warning" align="center">
                    Watch
                  </Text>
                </button>
              </Popover>
            }
          />
          <Gauge
            size="md"
            value={85}
            label="Score"
            description={
              <Layout.Flex direction="column" gapY="2xs" align="center">
                <Text variant="caption-normal" color="success" align="center">
                  Good
                </Text>
                <Text variant="caption-normal" color="foreground-3" align="center">
                  Updated 5 min ago
                </Text>
              </Layout.Flex>
            }
          />
        </Layout.Flex>
      </Layout.Flex>
    </Layout.Flex>
  )
}

export default GaugeDemo
