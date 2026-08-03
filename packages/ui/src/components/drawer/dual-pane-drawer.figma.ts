// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28328-37160
// source=packages/ui/src/components/drawer/index.ts
// component=Drawer

import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.findText('Drawer Title', { traverseInstances: true }).textContent

// DualPaneDrawer's content slot is consumer-composed and isn't a Figma property of this component.
// This shows a representative, illustrative example of the dual-pane shell with a title, back
// button, and footer actions — the real content and handlers are wired up by the consumer.
export default {
  example: figma.code`
    <Drawer.DualPane>
      <Drawer.DualPaneMain>
        <Drawer.Header>
          <Drawer.Title>${title}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>Content goes here</Drawer.Body>
        <Drawer.Footer>
          <Button variant="outline">Back</Button>
          <Button variant="outline">Secondary action</Button>
          <Button>Continue</Button>
        </Drawer.Footer>
      </Drawer.DualPaneMain>
    </Drawer.DualPane>
  `,
  imports: ['import { Drawer, Button } from "@harnessio/ui/components"'],
  id: 'dual-pane-drawer',
  metadata: {
    nestable: false
  }
}
