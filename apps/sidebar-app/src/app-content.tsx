import { type FC } from 'react'

import { Sidebar, Text } from '@harnessio/ui/components'

const insetChatPlaceholderLabel = 'Chat'
const insetPagePlaceholderLabel = 'App content'

export const AppContent: FC = () => (
  <Sidebar.Inset className="app-shell-content app-shell-inset min-h-0 w-full flex-1">
    <div className="app-shell-inset-inner">
      <aside className="app-shell-inset-chat app-shell-inset-card" aria-label={insetChatPlaceholderLabel}>
        <div className="app-shell-inset-placeholder">
          <Text variant="body-normal" color="foreground-3">
            {insetChatPlaceholderLabel}
          </Text>
        </div>
      </aside>
      <main className="app-shell-inset-page app-shell-inset-card" aria-label={insetPagePlaceholderLabel}>
        <div className="app-shell-inset-placeholder">
          <Text variant="body-normal" color="foreground-3">
            {insetPagePlaceholderLabel}
          </Text>
        </div>
      </main>
    </div>
  </Sidebar.Inset>
)
