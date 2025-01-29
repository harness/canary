import { FC } from 'react'

import { DocsPage } from '@components/docs-page/docs-page'

import { Text } from '@harnessio/ui/components'

const AlertComponent: FC = () => (
  <DocsPage.Root>
    <DocsPage.Summary title="Alert">
      <Text as="p">A warning message showing that attention is required.</Text>
    </DocsPage.Summary>

    <DocsPage.ComponentExample
      code={`
<Alert.Container>
  <Alert.Title>This is an alert</Alert.Title>
  <Alert.Description>An alert has happened and someone should look into that.</Alert.Description>
</Alert.Container>
`}
    />

    <DocsPage.Section title="Alert.Container">
      <Text as="p">The Alert.Container component is a thing</Text>
      <DocsPage.ComponentExample code={`<Alert.Container>This is a test</Alert.Container>`} />
    </DocsPage.Section>
  </DocsPage.Root>
)

export default AlertComponent
