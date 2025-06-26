import {
  IconV2,
  Layout,
  LogoV2,
  StatsPanel,
  StatusBadge,
  Tag,
  Text,
  ViewOnly,
  ViewOnlyProps,
  Widgets,
  Table, Link
} from '@harnessio/ui/components'
import { timeAgo } from '@harnessio/ui/utils'
import { Page } from '@harnessio/ui/views'

const dataMock: ViewOnlyProps[] = [
  {
    title: 'Overview',
    data: [
      {
        label: 'Connector name',
        value: 'Harness Docker'
      },
      {
        label: 'Connector ID',
        value: 'harnessdocker'
      },
      {
        label: 'Type',
        value: 'Docker'
      },
      {
        label: 'Created On',
        value: '02/08/2024'
      },
      {
        label: 'Created By',
        value: 'brad.rydzewski'
      },
      {
        label: 'Terms of service agreed to',
        value: '02/08/2024'
      },
      {
        label: 'Updated By',
        value: 'brad.rydzewski'
      }
    ]
  },
  {
    title: 'Cloning',
    data: [
      {
        label: 'SSH Key',
        value: (
          <div className="flex items-center gap-1">
            <IconV2 name="custom-secret-manager" /> secret-1
          </div>
        )
      }
    ]
  },
  {
    title: 'Connection',
    data: [
      {
        label: 'Delegates',
        value: (
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-1">
              <LogoV2 size="sm" name="app-dynamics" /> delegate-1
            </div>
            <div className="inline-flex items-center gap-1">
              <LogoV2 size="sm" name="katalon" /> delegate-2
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'Resources',
    data: [
      {
        label: 'Organization',
        value: 'Octocat'
      },
      {
        label: 'Repository',
        value: 'Octocat'
      },
      {
        label: 'Test Repository',
        value: 'Octocat'
      },
      {
        label: 'Branch',
        value: 'main'
      },
      {
        label: 'Connector',
        value: 'Docker'
      },
      {
        label: 'Secret',
        value: 'AWS secret'
      }
    ]
  },
  {
    title: 'Metadata',
    data: [
      {
        label: 'Labels',
        value: (
          <Layout.Flex wrap="wrap" gap="xs">
            <Tag variant="secondary" value="connector" theme="violet" />
            <Tag variant="secondary" value="new" theme="violet" />
            <Tag variant="secondary" value="main" theme="violet" />
            <Tag variant="secondary" value="integration" theme="violet" />
            <Tag variant="secondary" value="automation" theme="violet" />
            <Tag variant="secondary" value="test" theme="violet" />
            <Tag variant="secondary" value="dev" theme="violet" />
            <Tag variant="secondary" value="prod" theme="violet" />
          </Layout.Flex>
        )
      },
      {
        label: 'Description',
        value: 'Preconfigured Docker connector for use in Harness.'
      }
    ]
  }
]

export const ViewOnlyView = () => {
  return (
    <Page.Root>
      <Page.Header
        backLink={{
          linkText: 'Back to connectors',
          linkProps: { to: '/' }
        }}
        logoName="node-js"
        title="harnessdocker"
        description="Preconfigured Docker connector for use in Harness."
        button={{
          props: {
            onClick: () => console.log('Click')
          },
          text: 'Test Connection'
        }}
        moreActions={[
          { title: 'Action 1', onClick: () => console.log('Action 1') },
          { title: 'Action 2', onClick: () => console.log('Action 2') }
        ]}
      >
        <Layout.Flex wrap="wrap" gap="xs" align="baseline">
          <Text color="foreground-3">Labels:</Text>
          <Tag variant="secondary" value="connector" theme="violet" />
          <Tag variant="secondary" value="new" theme="violet" />
          <Tag variant="secondary" value="main" theme="violet" />
          <Tag variant="secondary" value="integration" theme="violet" />
          <Tag variant="secondary" value="automation" theme="violet" />
          <Tag variant="secondary" value="+3 labels" theme="violet" />
        </Layout.Flex>
        <StatsPanel
          data={[
            { label: 'Created', value: timeAgo('Dec 6, 2024', { dateStyle: 'medium' }) },
            { label: 'Last updated', value: null },
            { label: 'Last status check', value: timeAgo('Jun 6, 2025', { dateStyle: 'medium' }) },
            { label: 'Last successful check', value: null },
            {
              label: 'Connection status',
              value: (
                <StatusBadge variant="status" theme="success">
                  Success
                </StatusBadge>
              )
            }
          ]}
        />
      </Page.Header>
      <Page.Content>
        <Widgets.Root isTwoColumn>
          <Widgets.Item title="Connector details">
            {dataMock.map((props, index) => (
              <ViewOnly key={index} {...props} />
            ))}
          </Widgets.Item>

          <Widgets.Item
            title="Activity history"
            moreLink={{
              to: '/'
            }}
          >
            {dataMock.slice(0, 2).map((props, index) => (
              <ViewOnly key={index} {...props} />
            ))}
          </Widgets.Item>

          <Widgets.Item
              title="Secrets"
              moreLink={{
                to: '/'
              }}
              isWidgetTable
          >
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Event</Table.Head>
                  <Table.Head>Type</Table.Head>
                  <Table.Head>Scope</Table.Head>
                  <Table.Head>Created</Table.Head>
                  <Table.Head />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Text color="foreground-1" variant="body-strong">secretfile</Text>
                  </Table.Cell>
                  <Table.Cell>Pipeline</Table.Cell>
                  <Table.Cell>
                    <Link to="/">default_project</Link>
                  </Table.Cell>
                  <Table.Cell>
                    {timeAgo('Dec 6, 2024', { dateStyle: 'medium' })}
                  </Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Widgets.Item>
        </Widgets.Root>
      </Page.Content>
    </Page.Root>
  )
}
