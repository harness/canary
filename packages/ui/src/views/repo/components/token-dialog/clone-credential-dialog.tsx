import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonLayout, CopyButton, ModalDialog, TextInput } from '@/components'
<<<<<<< HEAD
import { useTranslation } from '@/context'
=======
import { TranslationStore } from '@/views'
>>>>>>> eab5cb900 (add button layout component for buttons inside modal dialog footer)
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
    <ModalDialog.Root open={open} onOpenChange={onClose}>
      <ModalDialog.Content>
        <ModalDialog.Header>
          <ModalDialog.Title>{t('views:repos.cloneCredential', 'Generate Clone Credential')}</ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <div className="flex flex-col gap-y-7">
            {/* NAME */}

            <TextInput
              className="py-px truncate"
              id="identifier"
              label={t('views:repos.name')}
              value={tokenData?.identifier}
              readOnly
              suffix={<CopyButton buttonVariant="transparent" iconSize={14} name={tokenData?.identifier} />}
            />

            <TextInput
              className="py-px"
              id="lifetime"
              label={t('views:repos.expiration')}
              value={tokenData?.lifetime}
              readOnly
            />

            {/* Expiration Info */}
            <TextInput
              className="truncate py-px"
              id="token"
              label={t('views:repos.token')}
              value={tokenData?.token}
              readOnly
              suffix={<CopyButton buttonVariant="transparent" iconSize={14} name={tokenData?.token} />}
              autoFocus
            />

            <span>{t('views:repos.cloneCredGenerated')}</span>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ButtonLayout>
            <ModalDialog.Close onClick={onClose}>Close</ModalDialog.Close>
            <Button type="button" onClick={() => navigateToManageToken?.()}>
              {t('views:repos.manageAPIToken')}
            </Button>
          </ButtonLayout>
        </ModalDialog.Footer>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}

CloneCredentialDialog.displayName = 'CloneCredentialDialog'
