import { Button, IconV2, Text } from '@harnessio/ui/components'

/**
 * Simple Hello World page for testing the Harness Design System.
 *
 * Styles are already loaded by the design-system app via:
 *   import '@harnessio/ui/styles.css'
 *
 * If you were setting up a brand-new app outside this monorepo, you would
 * also import these once at your app entry point:
 *   import '@harnessio/core-design-system/core-styles'
 *   import '@harnessio/core-design-system/themes'
 */
const HelloWorld = () => {
  return (
    <div className="bg-cn-1 flex min-h-screen flex-col items-start gap-cn-md p-cn-xl">
      <Text variant="heading-section" className="text-cn-1">
        Hello World
      </Text>

      <Text variant="body-normal" className="text-cn-2">
        This page uses Harness Design System components.
      </Text>

      <Button variant="primary" onClick={() => alert('Button clicked!')}>
        <IconV2 name="check" skipSize />
        Click Me
      </Button>
    </div>
  )
}

export default HelloWorld
