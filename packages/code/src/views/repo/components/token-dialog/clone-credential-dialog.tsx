import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button, ButtonLayout, CopyButton, Dialog, TextInput } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

interface RoutingProps {
  navigateToManageToken?: () => void
}
interface CloneCredentialDialogProps extends Partial<RoutingProps> {
  open: boolean
  onClose: () => void
  tokenData: {
    identifier: string
    lifetime: string
    token: string
  }
}
const formSchema = z.object({
  identifier: z.string(),
  lifetime: z.string(),
  token: z.string()
})

export type TCloneCredentialsDialog = z.infer<typeof formSchema>

export const CloneCredentialDialog: FC<CloneCredentialDialogProps> = ({
  open,
  onClose,
  navigateToManageToken,
  tokenData
}) => {
  const { t } = useTranslation()
  useForm<TCloneCredentialsDialog>({
    resolver: zodResolver(formSchema),
    defaultValues: tokenData
  })
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{t('views:repos.cloneCredential', 'Generate Clone Credential')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <TextInput
            className="truncate"
            id="identifier"
            label={t('views:repos.name')}
            value={tokenData?.identifier}
            readOnly
            suffix={<CopyButton buttonVariant="transparent" iconSize="xs" name={tokenData?.identifier} />}
          />

          <TextInput id="lifetime" label={t('views:repos.expiration')} value={tokenData?.lifetime} readOnly />

          <TextInput
            className="truncate"
            id="token"
            label={t('views:repos.token')}
            value={tokenData?.token}
            readOnly
            suffix={<CopyButton buttonVariant="transparent" iconSize="xs" name={tokenData?.token} />}
            autoFocus
          />

          <span>{t('views:repos.cloneCredGenerated')}</span>
        </Dialog.Body>
        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={onClose}>Close</Dialog.Close>
            <Button type="button" onClick={() => navigateToManageToken?.()}>
              {t('views:repos.manageAPIToken')}
            </Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

CloneCredentialDialog.displayName = 'CloneCredentialDialog'
