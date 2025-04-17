import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, CopyButton, Dialog, Input } from '@/components'
import { TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface RoutingProps {
  navigateToManageToken?: () => void
}
interface CloneCredentialDialogProps extends Partial<RoutingProps> {
  open: boolean
  onClose: () => void
  useTranslationStore: () => TranslationStore
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
  tokenData,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  useForm<TCloneCredentialsDialog>({
    resolver: zodResolver(formSchema),
    defaultValues: tokenData
  })
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title>{t('views:repos.cloneCredential', 'Generate Clone Credential')}</Dialog.Title>
        </Dialog.Header>
        <div className="flex flex-col gap-y-7">
          {/* NAME */}

          <Input
            className="py-px"
            id="identifier"
            label={t('views:repos.name')}
            value={tokenData?.identifier}
            readOnly
            variant="extended"
            rightElementVariant="default"
            rightElement={<CopyButton name={tokenData?.identifier} />}
          />

          <Input
            className="py-px"
            id="lifetime"
            label={t('views:repos.expiration')}
            value={tokenData?.lifetime}
            readOnly
          />

          {/* Expiration Info */}
          <Input
            className="truncate py-px"
            id="token"
            label={t('views:repos.token')}
            variant="extended"
            value={tokenData?.token}
            readOnly
            rightElementVariant="default"
            rightElement={<CopyButton name={tokenData?.token} />}
            autoFocus
          />

          <span>{t('views:repos.cloneCredGenerated')}</span>
        </div>
        <Dialog.Footer>
          <ButtonGroup>
            <>
              <Button variant="surface" theme="muted" onClick={onClose}>
                Close
              </Button>
              <Button type="button" onClick={() => navigateToManageToken?.()}>
                {t('views:repos.manageAPIToken')}
              </Button>
            </>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
