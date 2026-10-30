import * as React from 'react'
import { Button, Dialog, Text } from '@harnessio/ui'

export function Confirm() {
  return (
    <Dialog.Root open>
      <Dialog.Content size="sm">
        <Dialog.Header>
          <Dialog.Title>Delete pipeline</Dialog.Title>
          <Dialog.Description>This removes the pipeline and its execution history. This cannot be undone.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close variant="outline">Cancel</Dialog.Close>
          <Button theme="danger">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export function WithBody() {
  return (
    <Dialog.Root open>
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Rotate access token</Dialog.Title>
          <Dialog.Description>Generate a new token for the build-agent service account.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Text className="block">The current token stays valid for 24 hours after rotation.</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close variant="outline">Cancel</Dialog.Close>
          <Button>Rotate token</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
