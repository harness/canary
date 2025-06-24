import { IconV2, LogoV2, Tag, ViewOnly, ViewOnlyProps } from '@harnessio/ui/components'
import { PageHeader, SandboxLayout } from '@harnessio/ui/views'

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
          <div className="flex flex-wrap gap-1.5">
            <Tag variant="secondary" value="connector" theme="violet" />
            <Tag variant="secondary" value="new" theme="violet" />
            <Tag variant="secondary" value="main" theme="violet" />
            <Tag variant="secondary" value="integration" theme="violet" />
            <Tag variant="secondary" value="automation" theme="violet" />
            <Tag variant="secondary" value="test" theme="violet" />
            <Tag variant="secondary" value="dev" theme="violet" />
            <Tag variant="secondary" value="prod" theme="violet" />
          </div>
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
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <PageHeader
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
        />
        {dataMock.map((props, index) => (
          <ViewOnly key={index} {...props} />
        ))}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
