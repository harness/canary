// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6829-46702
// source=packages/ui/src/components/drawer/index.ts
// component=Drawer

import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.findText('Drawer Title', { traverseInstances: true }).textContent

const hasTagline = instance.getBoolean('tagline#6839:24')
const hasDescription = instance.getBoolean('description#6839:20')

// The header action buttons (back, reset, secondary action, CTA) and header/footer content slots
// are driven by nested private Figma sub-components that can't be dynamically mapped, so this
// shows a representative, illustrative example — the real actions and content are consumer-wired.
export default {
  example: figma.code`
    <Drawer.Root open>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>${title}</Drawer.Title>
          ${hasTagline ? '<Drawer.Tagline>Tagline</Drawer.Tagline>' : ''}
        </Drawer.Header>
        <Drawer.Body>
          ${hasDescription ? '<Drawer.Description>Description text</Drawer.Description>' : ''}
          Content goes here
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  `,
  imports: ['import { Drawer, Button } from "@harnessio/ui/components"'],
  id: 'drawer',
  metadata: {
    nestable: false
  }
}
