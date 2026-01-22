import { FC, ReactNode } from 'react'

import { IconV2, Layout, StatsPanel, Tabs, Text, TimeAgoCard } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { Page, type SecretListItem } from '@/views'

interface SecretDetailsLayoutProps {
  secret: SecretListItem
  backButtonTo?: () => string
  configurationView?: ReactNode
  referencesView?: ReactNode
  activityView?: ReactNode
  isLoading?: boolean
  actions?: ReactNode
}

enum SecretDetailsTabsKeys {
  OVERVIEW = 'overview',
  REFERENCES = 'references',
  RUNTIME_USAGE = 'runtime-usage'
}

export const SecretDetailsLayout: FC<SecretDetailsLayoutProps> = ({
  secret,
  backButtonTo,
  configurationView,
  referencesView,
  activityView,
  isLoading = false,
  actions
}) => {
  const { t } = useTranslation()
  const { Switch, Route } = useRouterContext()

  const titleContent = (
    <Layout.Horizontal gap="xs" align="center" className="justify-between">
      <Layout.Horizontal gapX="xs" align="center">
        <div className="mt-cn-4xs">
          <IconV2 name="key" size="lg" />
        </div>
        <Text as="h1" variant="heading-section" truncate>
          {secret?.name ?? ''}
        </Text>
      </Layout.Horizontal>
      {actions}
    </Layout.Horizontal>
  )

  return (
    <Page.Root>
      <Page.Header
        isLoading={isLoading}
        backLink={{
          linkText: t('views:secretDetails.backToSecrets', 'All Secrets'),
          linkProps: { to: backButtonTo?.() ?? '' }
        }}
        title={titleContent}
      >
        <StatsPanel
          isLoading={isLoading}
          data={[
            {
              label: t('views:secretDetails.created', 'Created'),
              value: secret?.createdAt ? (
                <TimeAgoCard timestamp={secret.createdAt} textProps={{ color: 'foreground-1' }} />
              ) : undefined
            },
            {
              label: t('views:secretDetails.updated', 'Updated'),
              value: secret?.updatedAt ? (
                <TimeAgoCard timestamp={secret.updatedAt} textProps={{ color: 'foreground-1' }} />
              ) : undefined
            },
            {
              label: t('views:secretDetails.lastUsed', 'Last used'),
              value: secret?.updatedAt ? (
                <TimeAgoCard timestamp={secret.updatedAt} textProps={{ color: 'foreground-1' }} />
              ) : undefined
            }
          ]}
        />
      </Page.Header>
      <Page.Content>
        <Tabs.NavRoot>
          <Tabs.List className="mb-cn-sm -mt-cn-2xs">
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
