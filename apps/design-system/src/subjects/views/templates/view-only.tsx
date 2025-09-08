import {
  IconV2,
  Layout,
  Link,
  LogoV2,
  StatsPanel,
  StatusBadge,
  Table,
  Tabs,
  Tag,
  Text,
  TimeAgoCard,
  Toggle,
  ViewOnly,
  ViewOnlyProps,
  Widgets
} from '@harnessio/ui/components'
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
              <LogoV2 size="xs" name="app-dynamics" /> delegate-1
            </div>
            <div className="inline-flex items-center gap-1">
              <LogoV2 size="xs" name="katalon" /> delegate-2
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
            {
              label: 'Created',
              value: <TimeAgoCard timestamp="Dec 6, 2024" dateTimeFormatOptions={{ dateStyle: 'medium' }} />
            },
            { label: 'Last updated', value: null },
            {
              label: 'Last status check',
              value: <TimeAgoCard timestamp="Jun 6, 2025" dateTimeFormatOptions={{ dateStyle: 'medium' }} />
            },
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
        <Tabs.NavRoot defaultValue="/dashboard">
          <Tabs.List variant="overlined" className="mb-10">
            <Tabs.Trigger value="/dashboard">Сonfiguration</Tabs.Trigger>
            <Tabs.Trigger value="/analytics">References</Tabs.Trigger>
            <Tabs.Trigger value="/reports">Activity History</Tabs.Trigger>
          </Tabs.List>
        </Tabs.NavRoot>

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
                    <Layout.Flex direction="row" gap="xs" align="center">
                      <LogoV2 name="servicenow" />
                      <Text color="foreground-1" variant="body-strong">
                        secretfile
                      </Text>
                    </Layout.Flex>
                  </Table.Cell>
                  <Table.Cell>Pipeline</Table.Cell>
                  <Table.Cell>
                    <Link to="/">default_project</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <TimeAgoCard
                      timestamp="Dec 6, 2024"
                      dateTimeFormatOptions={{ dateStyle: 'medium' }}
                      textProps={{ wrap: 'nowrap' }}
                    />
                  </Table.Cell>
                  <Table.Cell align="right" width="40">
                    <Toggle prefixIcon="pin" iconOnly />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Layout.Flex direction="row" gap="xs" align="center">
                      <LogoV2 name="android" />
                      <Text color="foreground-1" variant="body-strong">
                        testsecret
                      </Text>
                    </Layout.Flex>
                  </Table.Cell>
                  <Table.Cell>Secret</Table.Cell>
                  <Table.Cell>
                    <Link to="/">default_project</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <TimeAgoCard
                      timestamp="Dec 6, 2024"
                      dateTimeFormatOptions={{ dateStyle: 'medium' }}
                      textProps={{ wrap: 'nowrap' }}
                    />
                  </Table.Cell>
                  <Table.Cell align="right" width="40">
                    <Toggle prefixIcon="pin" iconOnly />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Layout.Flex direction="row" gap="xs" align="center">
                      <LogoV2 name="argo" />
                      <Text color="foreground-1" variant="body-strong">
                        jamiegit
                      </Text>
                    </Layout.Flex>
                  </Table.Cell>
                  <Table.Cell>Service</Table.Cell>
                  <Table.Cell>
                    <Link to="/">default_project</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <TimeAgoCard
                      timestamp="Dec 6, 2024"
                      dateTimeFormatOptions={{ dateStyle: 'medium' }}
                      textProps={{ wrap: 'nowrap' }}
                    />
                  </Table.Cell>
                  <Table.Cell align="right" width="40">
                    <Toggle prefixIcon="pin" iconOnly />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Layout.Flex direction="row" gap="xs" align="center">
                      <LogoV2 name="artifactory" />
                      <Text color="foreground-1" variant="body-strong">
                        nofar123
                      </Text>
                    </Layout.Flex>
                  </Table.Cell>
                  <Table.Cell>Template</Table.Cell>
                  <Table.Cell>
                    <Link to="/">default_project</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <TimeAgoCard
                      timestamp="Dec 6, 2024"
                      dateTimeFormatOptions={{ dateStyle: 'medium' }}
                      textProps={{ wrap: 'nowrap' }}
                    />
                  </Table.Cell>
                  <Table.Cell align="right" width="40">
                    <Toggle prefixIcon="pin" iconOnly />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Layout.Flex direction="row" gap="xs" align="center">
                      <LogoV2 name="android" />
                      <Text color="foreground-1" variant="body-strong">
                        nofarb
                      </Text>
                    </Layout.Flex>
                  </Table.Cell>
                  <Table.Cell>Secret</Table.Cell>
                  <Table.Cell>
                    <Link to="/">default_project</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <TimeAgoCard
                      timestamp="Dec 6, 2024"
                      dateTimeFormatOptions={{ dateStyle: 'medium' }}
                      textProps={{ wrap: 'nowrap' }}
                    />
                  </Table.Cell>
                  <Table.Cell align="right" width="40">
                    <Toggle prefixIcon="pin" iconOnly />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Layout.Flex direction="row" gap="xs" align="center">
                      <LogoV2 name="servicenow" />
                      <Text color="foreground-1" variant="body-strong">
                        githubtoken
                      </Text>
                    </Layout.Flex>
                  </Table.Cell>
                  <Table.Cell>Pipeline</Table.Cell>
                  <Table.Cell>
                    <Link to="/">default_project</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <TimeAgoCard
                      timestamp="Dec 6, 2024"
                      dateTimeFormatOptions={{ dateStyle: 'medium' }}
                      textProps={{ wrap: 'nowrap' }}
                    />
                  </Table.Cell>
                  <Table.Cell align="right" width="40">
                    <Toggle prefixIcon="pin" iconOnly />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Widgets.Item>
        </Widgets.Root>
      </Page.Content>
    </Page.Root>
  )
}
