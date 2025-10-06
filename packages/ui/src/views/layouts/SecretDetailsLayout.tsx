import { FC, ReactNode } from 'react'

import {Layout, Link, PermissionIdentifier, ResourceType, Spacer, StatsPanel, Text, TimeAgoCard} from '@/components'
import { Tabs } from '@/components/tabs'
import { useComponents, useCustomDialogTrigger, useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@views/layouts/SandboxLayout'
import { SecretListItem } from '@views/secrets'
import {Page} from "@/views";

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
  const { t } = useTranslation()
  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const handleDelete = (id: string) => {
    registerTrigger()
    onDelete?.(id)
  }

  const handleEdit = (id: string) => {
    registerTrigger()
    onEdit?.(id)
  }

  return (
    <Layout.Horizontal justify="between" align="center" className="mt-cn-xs">
      <Layout.Horizontal gap="3xl">
        <Layout.Vertical gap="sm">
          <Text color="foreground-3">Created</Text>
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
            title: t('views:secrets.edit', 'Edit secret'),
            iconName: 'edit-pencil',
            onClick: () => handleEdit(identifier ?? ''),
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
            title: t('views:secrets.delete', 'Delete secret'),
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
    <Page.Root>
        <Page.Header
            backLink={{
                linkText: t('views:secretDetails.backToSecrets', 'Back to secrets'),
                linkProps: { to: backButtonTo?.() ?? '' }
            }}
            title={secret?.name ?? ''}
            moreActions={[
                {
                    title: t('views:secrets.edit', 'Edit secret'),
                    iconName: 'edit-pencil',
                    onClick: () => onEdit?.(secret.identifier),
                    rbac: {
                        resource: {
                            resourceType: ResourceType.SECRET,
                            resourceIdentifier: secret.identifier
                        },
                        permissions: [PermissionIdentifier.UPDATE_SECRET]
                    }
                },
                {
                    isDanger: true,
                    title: t('views:secrets.delete', 'Delete secret'),
                    iconName: 'trash',
                    onClick: () => onDelete?.(secret.identifier),
                    rbac: {
                        resource: {
                            resourceType: ResourceType.SECRET,
                            resourceIdentifier: secret.identifier
                        },
                        permissions: [PermissionIdentifier.DELETE_SECRET]
                    }
                }
            ]}
        >
            <StatsPanel
                data={[
                    {
                        label: 'Created',
                        value: secret?.createdAt ?
                            <TimeAgoCard timestamp={secret.createdAt} dateTimeFormatOptions={DATE_FORMAT_OPTIONS} /> :
                            undefined
                    },
                    {
                        label: 'Last used',
                        value: secret?.updatedAt ?
                            <TimeAgoCard timestamp={secret.updatedAt} dateTimeFormatOptions={DATE_FORMAT_OPTIONS} /> :
                            undefined
                    },
                    {
                        label: 'Last updated',
                        value: secret?.updatedAt ?
                            <TimeAgoCard timestamp={secret.updatedAt} dateTimeFormatOptions={DATE_FORMAT_OPTIONS} /> :
                            undefined
                    }
                ]}
            />
        </Page.Header>
        <Page.Content>
      <Tabs.NavRoot>
        <Tabs.List className="cn-sandbox-layout-tabs mb-cn-3xl" variant="overlined">
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
        </Page.Content>
    </Page.Root>
  )
}
