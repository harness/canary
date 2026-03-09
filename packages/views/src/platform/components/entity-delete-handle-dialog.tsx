import { useState } from 'react'

import { Alert, AlertDialog, Button, Checkbox, Layout, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

interface EntityDeleteHandleDialogProps {
  isOpen: boolean
  entityType: string
  entityId: string
  onClose: () => void
  onViewReferences?: () => void
  forceDeleteCallback?: () => void
  customMessage?: string
  customWarning?: string
  isLoading?: boolean
  error?: string
}

export const EntityDeleteHandleDialog = ({
  isOpen,
  onClose,
  forceDeleteCallback,
  onViewReferences,
  entityType,
  entityId,
  customMessage,
  customWarning,
  isLoading,
  error
}: EntityDeleteHandleDialogProps): JSX.Element => {
  const { t } = useTranslation()
  const [forcedDeleteEnabled, setForcedDeleteEnabled] = useState<boolean>(false)

  return (
    <AlertDialog.Root
      theme="danger"
      open={isOpen}
      onOpenChange={onClose}
      onConfirm={forceDeleteCallback || (() => {})}
      loading={isLoading}
    >
      <AlertDialog.Content
        title={t('views:entity.cantDelete', `Can't delete  ${entityType}`, {
          entity: entityType
        })}
      >
        <Layout.Vertical gapY="xs" className="items-start">
          <Text className="break-words" wrap="wrap">
            {customMessage ??
              t(
                'views:entity.cantDeleteMessage',
                `The ${entityType} [${entityId}] is being referenced in other entities. Please remove the referenced ${entityType} from affected entities before deleting.`,
                {
                  entity: entityType,
                  entityId
                }
              )}
          </Text>

          {onViewReferences && (
            <Button variant="link" onClick={onViewReferences}>
              {t('views:entity.viewReferences', 'View references')}
            </Button>
          )}
          {forceDeleteCallback && (
            <Checkbox
              id="force-delete"
              checked={forcedDeleteEnabled}
              onCheckedChange={(checked: boolean) => setForcedDeleteEnabled(checked)}
              label={t('views:entity.forceDelete', `Forcefully delete this ${entityType} now`, {
                entity: entityType
              })}
            />
          )}
          {forcedDeleteEnabled && (
            <Alert.Root theme="warning">
              <Alert.Description>
                {customWarning ??
                  t(
                    'views:entity.forceDeleteWarning',
                    `Forceful deletion might render entities referencing this ${entityType} invalid and will need to be updated.`,
                    {
                      entity: entityType
                    }
                  )}
              </Alert.Description>
            </Alert.Root>
          )}
        </Layout.Vertical>
        {!!error && (
          <Alert.Root theme="danger">
            <Alert.Title>Failed to perform delete operation</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}
        <AlertDialog.Cancel />
        <AlertDialog.Confirm disabled={!forcedDeleteEnabled}>{t('views:entity.delete', 'Delete')}</AlertDialog.Confirm>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
