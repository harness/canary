import * as React from 'react'
import { PromptInput } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <PromptInput.Root>
        <PromptInput.Textarea placeholder="Ask about your pipelines..." />
        <PromptInput.Toolbar>
          <PromptInput.Tools>
            <PromptInput.Button text="Attach file" prefixIcon="attachment" />
          </PromptInput.Tools>
          <PromptInput.Submit />
        </PromptInput.Toolbar>
      </PromptInput.Root>
    </div>
  )
}
export function WithTags() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <PromptInput.Root>
        <PromptInput.Tags tags={[{ id: '1', displayName: 'build-and-deploy' } as any, { id: '2', displayName: 'canary' } as any]} />
        <PromptInput.Textarea defaultValue="Why is this pipeline slow?" />
        <PromptInput.Toolbar>
          <PromptInput.Tools>
            <PromptInput.Button text="Attach file" prefixIcon="attachment" />
          </PromptInput.Tools>
          <PromptInput.Submit />
        </PromptInput.Toolbar>
      </PromptInput.Root>
    </div>
  )
}
