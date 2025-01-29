import { FC } from 'react'

import { DocsPage } from '@components/docs-page/docs-page'

import { Text } from '@harnessio/ui/components'

const BadgeComponent: FC = () => (
  <DocsPage.Root>
    <DocsPage.Summary title="Badge">
      <Text as="p">
        A label that shows the status of an object, emphasizes an element that requires attention, or helps categorize
        with other similar elements.
      </Text>
    </DocsPage.Summary>

    <DocsPage.ComponentExample code={`<Badge>Label</Badge>`} />

    <DocsPage.Section title="Size">
      <DocsPage.ComponentExample code={`<Badge size={1}>Label</Badge>`} />
    </DocsPage.Section>
  </DocsPage.Root>
)

export default BadgeComponent
