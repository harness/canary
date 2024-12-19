import { FC } from 'react'

import { DocsPage } from '@components/docs-page/docs-page'

import { Text } from '@harnessio/ui/components'

const dropdown = `
      <DropdownMenu>
        <DropdownMenuTrigger insideSplitButton>
          <Icon name="chevron-down" size={11} className="chevron-down" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-1">
          <DropdownMenuGroup>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
`

const onClick = () => alert('Button clicked')
const scope = { onClick }

const ButtonComponent: FC = () => (
  <DocsPage.Root>
    <DocsPage.Summary title="Button">
      <Text as="p">It is a button</Text>
    </DocsPage.Summary>

    <DocsPage.ComponentExample scope={scope} code={`<Button onClick={onClick}>I am a button</Button>`} />

    <DocsPage.Section
      title="Variants"
      description={<Text as="p">The `Button` component supports a number of variants using the `variant` prop.</Text>}
    >
      <DocsPage.ComponentExample
        scope={scope}
        code={`
    <Button variant="default" onClick={onClick}>Default variant</Button>
    <Button variant="destructive" onClick={onClick}>Destructive variant</Button>
    <Button variant="outline" onClick={onClick}>Outline variant</Button>
    <Button variant="secondary" onClick={onClick}>Secondary variant</Button>
    <Button variant="tertiary" onClick={onClick}>Tertiary variant</Button>
    <Button variant="ghost" onClick={onClick}>Ghost variant</Button>
    <Button variant="link" onClick={onClick}>Link variant</Button>
    <Button variant="link_accent" onClick={onClick}>Link accent variant</Button>
    <Button
      variant="split"
      dropdown={${dropdown}}
      onClick={onClick}
    >
      Split variant
    </Button>
    <Button variant="gradient-border" gradientType="bg-ai-button" onClick={onClick}>Gradient border variant</Button>
    <Button variant="custom" onClick={onClick}>Custom variant</Button>
  `}
      />
    </DocsPage.Section>

    <DocsPage.Section
      title="Size"
      description={<Text as="p">The `Button` component supports a number of sizes using the `size` prop.</Text>}
    >
      <DocsPage.ComponentExample
        scope={scope}
        code={`
    <Button size="default" onClick={onClick}>Default size</Button>
    <Button size="sm" onClick={onClick}>Small size</Button>
    <Button size="xs" onClick={onClick}>Extra small size</Button>
    <Button size="md" onClick={onClick}>Medium size</Button>
    <Button size="lg" onClick={onClick}>Large size</Button>
    <Button size="icon" onClick={onClick}><Icon name="triangle-warning" size="16" /></Button>
    <Button size="sm_icon" onClick={onClick}><Icon name="triangle-warning" size="12" /></Button>
    <Button
      onClick={onClick}
      variant="split"
      size="xs_split"
      dropdown={${dropdown}}
    >
      Extra small split size
    </Button>
    <Button
      onClick={onClick}
      variant="split"
      size="lg_split"
      dropdown={${dropdown}}
    >
      Large split size
    </Button>
`}
      />
    </DocsPage.Section>

    <DocsPage.Section
      title="Border radius"
      description={
        <Text as="p">The `Button` component supports a number of border radii using the `borderRadius` prop.</Text>
      }
    >
      <DocsPage.ComponentExample
        scope={scope}
        code={`
    <Button borderRadius="default" onClick={onClick}>Default border radius</Button>
    <Button borderRadius="full" onClick={onClick}>Full border radius</Button>
    <Button borderRadius="none" onClick={onClick}>No border radius</Button>
`}
      />
    </DocsPage.Section>

    <DocsPage.Section
      title="Theme"
      description={<Text as="p">The `Button` component supports a number of themes using the `theme` prop.</Text>}
    >
      <DocsPage.ComponentExample
        scope={scope}
        code={`
    <Button theme="default" onClick={onClick}>Default theme</Button>
    <Button theme="error" onClick={onClick}>Error theme</Button>
    <Button theme="warning" onClick={onClick}>Warning theme</Button>
    <Button theme="success" onClick={onClick}>Success theme</Button>
    <Button theme="muted" onClick={onClick}>Muted theme</Button>
    <Button theme="primary" onClick={onClick}>Primary theme</Button>
`}
      />
    </DocsPage.Section>

    <DocsPage.Section
      title="Padding"
      description={
        <Text as="p">The `Button` component supports a number of padding options using the `padding` prop.</Text>
      }
    >
      <DocsPage.ComponentExample
        scope={scope}
        code={`
    <Button padding="default" onClick={onClick}>Default padding</Button>
    <Button padding="sm" onClick={onClick}>Small padding</Button>
`}
      />
    </DocsPage.Section>

    <DocsPage.Section
      title="Gradient"
      description={
        <Text as="p">The `Button` component supports a number of gradient options using the `gradient` prop.</Text>
      }
    >
      <DocsPage.ComponentExample
        scope={scope}
        code={`
    <Button gradient="default" onClick={onClick}>Default gradient</Button>
`}
      />
    </DocsPage.Section>
  </DocsPage.Root>
)

export default ButtonComponent
