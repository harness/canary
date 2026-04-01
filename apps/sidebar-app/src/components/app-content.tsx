import { type CSSProperties, type FC } from 'react'

import { Sidebar, Text } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

const insetChatPlaceholderLabel = 'Chat'
const insetPagePlaceholderLabel = 'App content'

const insetChatFlex: CSSProperties = { flex: '0 0 clamp(280px, 32vw, 380px)' }

export const AppShellContent: FC = () => (
  <Sidebar.Inset
    className={cn(
      'app-shell-inset flex max-h-full min-h-0 w-full flex-1 flex-col overflow-hidden'
    )}
  >
    <div
      className={cn(
        'flex min-h-0 min-w-0 flex-1 items-stretch gap-cn-sm p-cn-sm'
      )}
    >
      <aside
        className={cn(
          'flex min-h-0 min-w-0 flex-col overflow-hidden border border-cn-2 bg-cn-0 shadow-cn-1 rounded-cn-6'
        )}
        style={insetChatFlex}
        aria-label={insetChatPlaceholderLabel}
      >
        <div
          className={cn(
            'flex min-h-0 flex-1 items-center justify-center p-cn-md'
          )}
        >
          <Text variant="body-normal" color="foreground-3">
            {insetChatPlaceholderLabel}
          </Text>
        </div>
      </aside>
      <main
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border border-cn-2 bg-cn-0 shadow-cn-1 rounded-cn-6'
        )}
        aria-label={insetPagePlaceholderLabel}
      >
        <div
          className={cn(
            'flex min-h-0 flex-1 items-center justify-center p-cn-md'
          )}
        >
          <Text variant="body-normal" color="foreground-3">
            {insetPagePlaceholderLabel}
          </Text>
        </div>
      </main>
    </div>
  </Sidebar.Inset>
)
