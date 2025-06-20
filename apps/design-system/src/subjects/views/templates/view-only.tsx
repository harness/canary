import { PageHeader, SandboxLayout } from '@harnessio/ui/views'

export const ViewOnly = () => {
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
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
