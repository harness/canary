import { Button, ButtonLayout, Drawer, Layout, Text } from '@harnessio/ui/components'

export const Good = () => (
  <Drawer.Root open>
    <Drawer.Content size="md">
      <Drawer.Header title="Create" />
      <Drawer.Body>
        <Layout.Vertical gap="lg">
          <Text variant="body-normal">Body</Text>
        </Layout.Vertical>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonLayout>
          <Button variant="primary">Create</Button>
        </ButtonLayout>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
)
