import { useForm } from 'react-hook-form'

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
  onManageToken: () => void
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
  onManageToken,
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
            suffixVariant="filled"
            suffix={<CopyButton name={tokenData?.identifier} />}
          />

          <Input id="lifetime" label={t('views:repos.expiration')} value={tokenData?.lifetime} readOnly />

          {/* Expiration Info */}
          <Input
            id="token"
            label={t('views:repos.token')}
            variant="extended"
            value={tokenData?.token}
            readOnly
            suffixVariant="filled"
            suffix={<CopyButton name={tokenData?.token} />}
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
              <Button type="button" onClick={onManageToken}>
                {t('views:repos.manageAPIToken')}
              </Button>
            </>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
