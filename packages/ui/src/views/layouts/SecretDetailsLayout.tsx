import { FC, ReactNode } from 'react'

import { PermissionIdentifier, ResourceType, StatsPanel, Tabs, Text, TimeAgoCard } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { Page, type SecretListItem } from '@/views'

interface SecretDetailsLayoutProps {
  secret: SecretListItem
  backButtonTo?: () => string
  configurationView?: ReactNode
  referencesView?: ReactNode
  activityView?: ReactNode
  onEdit?: (identifier: string) => void
  onDelete?: (identifier: string) => void
  isLoading?: boolean
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

export const SecretDetailsLayout: FC<SecretDetailsLayoutProps> = ({
  secret,
  backButtonTo,
  configurationView,
  referencesView,
  activityView,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const { t } = useTranslation()
  const { Switch, Route } = useRouterContext()

  return (
    <Page.Root>
      <Page.Header
        isLoading={isLoading}
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
          isLoading={isLoading}
          data={[
            {
              label: t('views:secretDetails.created', 'Created'),
              value: secret?.createdAt ? (
                <TimeAgoCard
                  timestamp={secret.createdAt}
                  dateTimeFormatOptions={DATE_FORMAT_OPTIONS}
                  textProps={{ color: 'foreground-1' }}
                />
              ) : undefined
            },
            {
              label: t('views:secretDetails.lastUsed', 'Last used'),
              value: secret?.updatedAt ? (
                <TimeAgoCard
                  timestamp={secret.updatedAt}
                  dateTimeFormatOptions={DATE_FORMAT_OPTIONS}
                  textProps={{ color: 'foreground-1' }}
                />
              ) : undefined
            },
            {
              label: t('views:secretDetails.lastUpdated', 'Last updated'),
              value: secret?.updatedAt ? (
                <TimeAgoCard timestamp={secret.updatedAt} dateTimeFormatOptions={DATE_FORMAT_OPTIONS} />
              ) : undefined
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
                /* Default Configuration View */
                <Text variant="body-normal">{t('views:secretDetails.configurationView', 'Secret Configuration')}</Text>
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
