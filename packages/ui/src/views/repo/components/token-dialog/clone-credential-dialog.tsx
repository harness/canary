import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import {
  Button,
  ButtonGroup,
  CopyButton,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input
} from '@/components'
import { TranslationStore } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface CloneCredentialDialogProps {
  open: boolean
  onClose: () => void
  toManageToken: string
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

export const CloneCredentialDialog: React.FC<CloneCredentialDialogProps> = ({
  open,
  onClose,
  toManageToken,
  tokenData,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  useForm<TCloneCredentialsDialog>({
    resolver: zodResolver(formSchema),
    defaultValues: tokenData
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[576px]">
        <DialogHeader>
          <DialogTitle>{t('views:repos.cloneCredential', 'Generate Clone Credential')}</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-y-7 pb-4">
          {/* NAME */}

          <Input
            id="identifier"
            label={t('views:repos.name')}
            value={tokenData?.identifier}
            readOnly
            variant="extended"
            rightElementVariant="default"
            rightElement={<CopyButton name={tokenData?.identifier} />}
          />

          <Input id="lifetime" label={t('views:repos.expiration')} value={tokenData?.lifetime} readOnly />

          {/* Expiration Info */}
          <Input
            id="token"
            label={t('views:repos.token')}
            variant="extended"
            value={tokenData?.token}
            readOnly
            rightElementVariant="default"
            rightElement={<CopyButton name={tokenData?.token} />}
            autoFocus
            className="truncate"
          />

          <span>{t('views:repos.cloneCredGenerated')}</span>
        </form>
        <DialogFooter>
          <ButtonGroup>
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button type="button">
                <Link to={toManageToken}>{t('views:repos.manageAPIToken')}</Link>
              </Button>
            </>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
