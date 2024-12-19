import { parseAsInteger, useQueryState } from 'nuqs'

import { Button, Spacer, Text } from '@harnessio/canary'
import {
  FormFieldSet,
  KeysList,
  PaginationComponent,
  ProfileKeysList,
  ProfileTokensList,
  SandboxLayout,
  TokensList
} from '@harnessio/views'

import { PageResponseHeader } from '../../types'
import { AlertDeleteParams } from './types'

interface SettingsAccountKeysPageProps {
  publicKeys: KeysList[]
  tokens: TokensList[]
  openTokenDialog: () => void
  openSshKeyDialog: () => void
  openAlertDeleteDialog: (data: AlertDeleteParams) => void
  error: { type: string; message: string } | null
  headers?: Headers
}
const SettingsAccountKeysPage: React.FC<SettingsAccountKeysPageProps> = ({
  publicKeys,
  tokens,
  openTokenDialog,
  openSshKeyDialog,
  openAlertDeleteDialog,
  error,
  headers
}) => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
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
                <Button type="button" variant="outline" className="text-primary" onClick={openTokenDialog}>
                  Add new token
                </Button>
              </span>
            </FormFieldSet.Legend>
            <FormFieldSet.ControlGroup>
              <>
                {(!error || error.type !== 'tokenFetch') && (
                  <ProfileTokensList tokens={tokens} openAlertDeleteDialog={openAlertDeleteDialog} />
                )}
                {error && error.type === 'tokenFetch' && (
                  <>
                    <Spacer size={2} />
                    <Text size={1} className="text-destructive">
                      {error.message}
                    </Text>
                  </>
                )}
              </>
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
                <Button variant="outline" className="text-primary" type="button" onClick={openSshKeyDialog}>
                  Add new SSH key
                </Button>
              </span>
            </FormFieldSet.SubLegend>
            <FormFieldSet.ControlGroup>
              <>
                {(!error || error.type !== 'keyFetch') && (
                  <>
                    <ProfileKeysList publicKeys={publicKeys} openAlertDeleteDialog={openAlertDeleteDialog} />
                    <PaginationComponent
                      totalPages={totalPages}
                      currentPage={page}
                      goToPage={(pageNum: number) => setPage(pageNum)}
                    />
                  </>
                )}
                {error && error.type === 'keyFetch' && (
                  <>
                    <Spacer size={2} />
                    <Text size={1} className="text-destructive">
                      {error.message}
                    </Text>
                  </>
                )}
              </>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SettingsAccountKeysPage }
