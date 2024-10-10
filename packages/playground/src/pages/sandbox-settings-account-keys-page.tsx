import React, { useState } from 'react'
import { Spacer, Text, Button } from '@harnessio/canary'
import { FormFieldSet, SandboxLayout } from '..'
import { ProfileKeysList } from '../components/profile-settings-keys-list'
import { ProfileTokensList } from '../components/profile-settings-tokens-list'
import { mockKeys } from './mocks/profile-settings/mockKeyList'
import { mockTokens } from './mocks/profile-settings/mockTokensList'
import { TokenCreateDialog } from '../components/token-create-dialog'
import { SshKeyCreateDialog } from '../components/ssh-key-create-dialog'

function SandboxSettingsAccountKeysPage() {
  const [openCreateTokenDialog, setCreateTokenDialog] = useState(false)
  const [saveSshKeyDialog, setSshKeyDialog] = useState(false)

  const closeSshKeyDialog = () => setSshKeyDialog(false)
  const closeTokenDialog = () => setCreateTokenDialog(false)

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Keys and tokens
        </Text>
        <Spacer size={6} />
        <form>
          <FormFieldSet.Root>
            {/* PERSONAL ACCESS TOKEN */}
            <FormFieldSet.Legend>
              <div className="flex justify-between">
                Personal access token
                <Button
                  type="button"
                  variant="outline"
                  className="text-primary"
                  onClick={() => setCreateTokenDialog(true)}>
                  Add new token
                </Button>
              </div>
            </FormFieldSet.Legend>
            <FormFieldSet.ControlGroup>
              <ProfileTokensList tokens={mockTokens} />
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
          <FormFieldSet.Root>
            <FormFieldSet.Separator />
          </FormFieldSet.Root>
          <FormFieldSet.Root>
            {/* PERSONAL ACCESS TOKEN */}
            <FormFieldSet.Legend>My SSH keys</FormFieldSet.Legend>
            <FormFieldSet.SubLegend>
              <div className="flex justify-between">
                SSH keys allow you to establish a secure connection to your code repository.
                <Button variant="outline" className="text-primary" type="button" onClick={() => setSshKeyDialog(true)}>
                  Add new SSH key
                </Button>
              </div>
            </FormFieldSet.SubLegend>
            <FormFieldSet.ControlGroup>
              <ProfileKeysList publicKeys={mockKeys} />
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>
        <TokenCreateDialog open={openCreateTokenDialog} onClose={closeTokenDialog} />
        <SshKeyCreateDialog open={saveSshKeyDialog} onClose={closeSshKeyDialog} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxSettingsAccountKeysPage }
