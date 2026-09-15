// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=18018-73008
// source=packages/ui/src/components/dialog.tsx
// component=Dialog

import figma from 'figma'

const instance = figma.selectedInstance

const hasIcon = instance.getBoolean('icon#6394:13')
const hasTitle = instance.getBoolean('title#6394:21')
const title = hasTitle ? instance.getString('title text#6394:1') : null

const hasDescription = instance.getBoolean('description#6394:25')
const description = hasDescription ? instance.getString('description text#6394:5') : null

const hasFooter = instance.getBoolean('footer#6397:5')
const hasTertiary = instance.getBoolean('tertiary action#7586:3')
const hasSecondary = instance.getBoolean('secondary action#7586:4')
const hasCTA = instance.getBoolean('CTA#7586:5')

// The tertiary/secondary/CTA footer buttons are separate instances of the same button component,
// so their text overrides share one property key and can't be read individually here — visibility
// is dynamic per button, but labels below are placeholders.

export default {
  example: figma.code`
    <Dialog.Root>
      <Dialog.Content size="max">
        <Dialog.Header ${hasIcon ? 'icon="info"' : ''}>
          ${title ? figma.code`<Dialog.Title>${title}</Dialog.Title>` : ''}
          ${description ? figma.code`<Dialog.Description>${description}</Dialog.Description>` : ''}
        </Dialog.Header>
        <Dialog.Body>Content</Dialog.Body>
        ${
          hasFooter
            ? figma.code`
        <Dialog.Footer>
          ${hasTertiary ? '<Button variant="ghost">Tertiary</Button>' : ''}
          ${hasSecondary ? '<Dialog.Close>Cancel</Dialog.Close>' : ''}
          ${hasCTA ? '<Button>Confirm</Button>' : ''}
        </Dialog.Footer>`
            : ''
        }
      </Dialog.Content>
    </Dialog.Root>
  `,
  imports: ['import { Dialog, Button } from "@harnessio/ui/components"'],
  id: 'dialog-max-height',
  metadata: {
    nestable: false
  }
}
