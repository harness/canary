import { Button, ButtonGroup, Topbar } from '@harnessio/canary'

export const ExecutionsTopBar: React.FC = () => {
  return (
    <Topbar.Root>
      <Topbar.Left>
        <>TODO: Add CommonBreadcrumbs here</>
      </Topbar.Left>
      <Topbar.Right>
        <ButtonGroup.Root>
          <Button variant="ghost" size="sm">
            Settings
          </Button>
          <Button size="sm">Run pipeline</Button>
        </ButtonGroup.Root>
      </Topbar.Right>
    </Topbar.Root>
  )
}
