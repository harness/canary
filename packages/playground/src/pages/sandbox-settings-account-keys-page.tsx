import React, { useState } from 'react'
import { Spacer, Text, Button } from '@harnessio/canary'
import { FormFieldSet, SandboxLayout } from '..'
import { ProfileKeysList } from '../components/profile-settings/profile-settings-keys-list'
import { ProfileTokensList } from '../components/profile-settings/profile-settings-tokens-list'
import { mockKeys } from './mocks/profile-settings/mockKeyList'
import { mockTokens } from './mocks/profile-settings/mockTokensList'
import { TokenCreateDialog } from '../components/profile-settings/token-create-dialog'
import { SshKeyCreateDialog } from '../components/profile-settings/ssh-key-create-dialog'
import { DeleteTokenAlertDialog } from '..'

function SandboxSettingsAccountKeysPage() {
  const [openCreateTokenDialog, setCreateTokenDialog] = useState(false)
  const [saveSshKeyDialog, setSshKeyDialog] = useState(false)
  const [isAlertDeleteDialogOpen, setIsAlertDeleteDialogOpen] = useState(false)
  const [alertParams, setAlertParams] = useState<{ identifier: string; type: string }>()

  const closeSshKeyDialog = () => setSshKeyDialog(false)
  const closeTokenDialog = () => setCreateTokenDialog(false)
  const closeAlertDeleteDialog = () => setIsAlertDeleteDialogOpen(false)
  const openAlertDeleteDialog = (params: { identifier: string; type: string }) => {
    setIsAlertDeleteDialogOpen(true)
    setAlertParams(params)
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Keys and Tokens
        </Text>
        <Spacer size={6} />
        <form>
          <FormFieldSet.Root>
            {/* PERSONAL ACCESS TOKEN */}
            <FormFieldSet.Legend>
              <span className="flex justify-between">
                Personal access token
                <Button
                  type="button"
                  variant="outline"
                  className="text-primary"
                  onClick={() => setCreateTokenDialog(true)}>
                  Add new token
                </Button>
              </span>
            </FormFieldSet.Legend>
            <FormFieldSet.ControlGroup>
              <ProfileTokensList
                tokens={mockTokens}
                openAlertDeleteDialog={() => openAlertDeleteDialog({ identifier: '', type: 'token' })}
              />
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
          <FormFieldSet.Root>
            <FormFieldSet.Separator />
          </FormFieldSet.Root>
          <FormFieldSet.Root>
            {/* PERSONAL ACCESS TOKEN */}
            <FormFieldSet.Legend>My SSH keys</FormFieldSet.Legend>
            <FormFieldSet.SubLegend>
              <span className="flex justify-between">
                SSH keys allow you to establish a secure connection to your code repository.
                <Button variant="outline" className="text-primary" type="button" onClick={() => setSshKeyDialog(true)}>
                  Add new SSH key
                </Button>
              </span>
            </FormFieldSet.SubLegend>
            <FormFieldSet.ControlGroup>
              <ProfileKeysList
                publicKeys={mockKeys}
                openAlertDeleteDialog={() => openAlertDeleteDialog({ identifier: '', type: 'key' })}
              />
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>
        <TokenCreateDialog open={openCreateTokenDialog} onClose={closeTokenDialog} />
        <SshKeyCreateDialog open={saveSshKeyDialog} onClose={closeSshKeyDialog} />
        <DeleteTokenAlertDialog
          open={isAlertDeleteDialogOpen}
          onClose={closeAlertDeleteDialog}
          deleteFn={() => {}}
          {...alertParams}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxSettingsAccountKeysPage }
