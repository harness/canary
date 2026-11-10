import { Button, Layout, Text } from '@harnessio/ui/components'

export function Good(): JSX.Element {
  return (
    <div className="bg-cn-1 p-cn-md" style={{ transform: 'scale(1)' }}>
      <Layout.Vertical gap="md">
        <Text color="success">Saved</Text>
        <Button variant="primary">Save</Button>
      </Layout.Vertical>
    </div>
  )
}
