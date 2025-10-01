import { FC, ReactNode } from 'react'

import { Layout, Link, PermissionIdentifier, ResourceType, Spacer, Text, TimeAgoCard } from '@/components'
import { Tabs } from '@/components/tabs'
import { useComponents, useCustomDialogTrigger, useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@views/layouts/SandboxLayout'
import { SecretListItem } from '@views/secrets'

interface SecretDetailsLayoutProps {
  secret: SecretListItem
  backButtonTo?: () => string
  configurationView?: ReactNode
  referencesView?: ReactNode
  activityView?: ReactNode
  onEdit?: (identifier: string) => void
  onDelete?: (identifier: string) => void
}

enum SecretDetailsTabsKeys {
  OVERVIEW = 'overview',
  REFERENCES = 'references',
  RUNTIME_USAGE = 'runtime-usage'
}

const DATE_FORMAT_OPTIONS = {
  month: 'short' as const,
  day: 'numeric' as const,
  year: 'numeric' as const
}

const useGetSecretInfo = (
  created?: string | number,
  lastUsed?: string | number,
  lastUpdated?: string | number,
  onEdit?: (identifier: string) => void,
  onDelete?: (identifier: string) => void,
  identifier?: string
) => {
  const { RbacMoreActionsTooltip } = useComponents()
  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const handleDelete = (id: string) => {
    registerTrigger()
    onDelete?.(id)
  }

  return (
    <Layout.Horizontal justify="between" align="center" className="mt-2">
      <Layout.Horizontal gap="3xl">
        <Layout.Vertical gap="sm">
          <Text variant="body-normal" className="text-cn-3">
            Created
          </Text>
          {created ? (
            <TimeAgoCard timestamp={created} dateTimeFormatOptions={DATE_FORMAT_OPTIONS} />
          ) : (
            <Text variant="body-normal">-</Text>
          )}
        </Layout.Vertical>
        <Layout.Vertical gap="sm">
          <Text variant="body-normal" className="text-cn-3">
            Last used
          </Text>
          {lastUsed ? (
            <TimeAgoCard timestamp={lastUsed} dateTimeFormatOptions={DATE_FORMAT_OPTIONS} />
          ) : (
            <Text variant="body-normal">-</Text>
          )}
        </Layout.Vertical>
        <Layout.Vertical gap="sm">
          <Text variant="body-normal" className="text-cn-3">
            Last updated
          </Text>
          {lastUpdated ? (
            <TimeAgoCard timestamp={lastUpdated} dateTimeFormatOptions={DATE_FORMAT_OPTIONS} />
          ) : (
            <Text variant="body-normal">-</Text>
          )}
        </Layout.Vertical>
      </Layout.Horizontal>
      <RbacMoreActionsTooltip
        ref={triggerRef}
        buttonVariant="outline"
        actions={[
          {
            isDanger: false,
            title: 'Edit secret',
            iconName: 'edit-pencil',
            onClick: () => onEdit?.(identifier ?? ''),
            rbac: {
              resource: {
                resourceType: ResourceType.SECRET,
                resourceIdentifier: identifier
              },
              permissions: [PermissionIdentifier.UPDATE_SECRET]
            }
          },
          {
            isDanger: true,
            title: 'Delete secret',
            iconName: 'trash',
            onClick: () => handleDelete(identifier ?? ''),
            rbac: {
              resource: {
                resourceType: ResourceType.SECRET,
                resourceIdentifier: identifier
              },
              permissions: [PermissionIdentifier.DELETE_SECRET]
            }
          }
        ]}
      />
    </Layout.Horizontal>
  )
}

export const SecretDetailsLayout: FC<SecretDetailsLayoutProps> = ({
  secret,
  backButtonTo,
  configurationView,
  referencesView,
  activityView,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation()
  const { Switch, Route } = useRouterContext()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content>
        <Layout.Vertical gap="md">
          <Link size="sm" prefixIcon to={backButtonTo?.() ?? ''}>
            {t('views:secretDetails.backToSecrets', 'Back to secrets')}
          </Link>
          <Layout.Horizontal align="center">
            <Text variant="heading-hero" className="break-all">
              {secret.name}
            </Text>
          </Layout.Horizontal>
          {useGetSecretInfo(secret.createdAt, secret.updatedAt, secret.updatedAt, onEdit, onDelete, secret.identifier)}
        </Layout.Vertical>
        <Spacer size={6} />
        <Tabs.NavRoot>
          <Tabs.List className="-mx-8 px-8" variant="overlined">
            <Tabs.Trigger value={SecretDetailsTabsKeys.OVERVIEW}>
              {t('views:secretDetails.configuration', 'Configuration')}
            </Tabs.Trigger>

            <Tabs.Trigger value={SecretDetailsTabsKeys.REFERENCES}>
              {t('views:secretDetails.references', 'References')}
            </Tabs.Trigger>

            <Tabs.Trigger value={SecretDetailsTabsKeys.RUNTIME_USAGE}>
              {t('views:secretDetails.activity', 'Activity')}
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.NavRoot>

        <Switch>
          <Route
            path="/overview"
            render={() =>
              configurationView || (
                <SandboxLayout.Content>
                  {/* Default Configuration View */}
                  <Text variant="body-normal">
                    {t('views:secretDetails.configurationView', 'Secret Configuration')}
                  </Text>
                </SandboxLayout.Content>
              )
            }
          />
          <Route path="/references">{referencesView}</Route>
          <Route path="/runtime-usage">{activityView}</Route>
        </Switch>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
