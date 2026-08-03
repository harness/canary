// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=17274-346489
// source=packages/ui/src/components/chat/prompt-input.tsx
// component=PromptInput

import figma from 'figma'

const instance = figma.selectedInstance

const hasHeaderTags = instance.getBoolean('header: tags#17277:0')
const hasTag02 = instance.getBoolean('tag-02#17277:4')
const hasTag03 = instance.getBoolean('tag-03#17277:5')

const placeholderOn = instance.getEnum('placeholder', { off: false, on: true })

const state = instance.getEnum('state', {
  default: 'default',
  hover: 'default',
  focused: 'default',
  'generating (locked)': 'generating'
})

const hasModelSelection = instance.getBoolean('model-selection#17277:3')
const hasArchitectMode = instance.getBoolean('architect-mode#17449:0')

export default {
  example: figma.code`
    <PromptInput.Root>
      ${
        hasHeaderTags
          ? figma.code`
        <PromptInput.Tags
          tags={[
            { id: "tag-01", displayName: "document.pdf", icon: "submit-document" }${
              hasTag02 ? ',\n            { id: "tag-02", displayName: "image.png", icon: "attachment-image" }' : ''
            }${hasTag03 ? ',\n            { id: "tag-03", displayName: "index.ts", icon: "code-brackets" }' : ''}
          ]}
        />
      `
          : ''
      }
      <PromptInput.Textarea ${placeholderOn ? '' : 'placeholder=""'} />
      <PromptInput.Toolbar>
        <PromptInput.Tools>
          <PromptInput.Button iconOnly prefixIcon="attachment" />
          ${hasArchitectMode ? '<PromptInput.Button iconOnly prefixIcon="settings" />' : ''}
          ${hasModelSelection ? '<Button variant="ghost" size="xs">Model</Button>' : ''}
        </PromptInput.Tools>
        <PromptInput.Submit ${state === 'generating' ? 'status="streaming"' : ''} />
      </PromptInput.Toolbar>
    </PromptInput.Root>
  `,
  imports: [
    'import { PromptInput } from "@harnessio/ui/components"',
    'import { Button } from "@harnessio/ui/components"'
  ],
  id: 'prompt-input',
  metadata: {
    nestable: true
  }
}
