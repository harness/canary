import { FC } from 'react'

import { Alert, Spacer } from '@/components'
import {
  PullRequestCommentBox,
  PullRequestCommentBoxProps,
  PullRequestFilterProps,
  PullRequestFilters,
  PullRequestOverview,
  PullRequestOverviewProps,
  PullRequestPanel,
  PullRequestPanelProps,
  PullRequestSideBar,
  PullRequestSideBarProps,
  SandboxLayout,
  TranslationStore
} from '@/views'

export interface PullRequestConversationPageProps {
  rebaseErrorMessage: string | null
  panelProps: PullRequestPanelProps
  filtersProps: PullRequestFilterProps<{ label: string; value: string }>
  overviewProps: Omit<PullRequestOverviewProps, 'useTranslationStore'>
  commentBoxProps: PullRequestCommentBoxProps
  sideBarProps: Omit<PullRequestSideBarProps, 'useTranslationStore'>
  useTranslationStore: () => TranslationStore
}

export const PullRequestConversationPage: FC<PullRequestConversationPageProps> = ({
  rebaseErrorMessage,
  panelProps,
  filtersProps,
  overviewProps,
  commentBoxProps,
  sideBarProps,
  useTranslationStore
}) => {
  return (
    <SandboxLayout.Columns columnWidths="minmax(calc(100% - 288px), 1fr) 288px">
      <SandboxLayout.Column>
        <SandboxLayout.Content className="pl-0 pr-8 pt-0">
          {/*TODO: update with design  */}
          {!!rebaseErrorMessage && (
            <Alert.Root theme="danger" className="mb-5" dismissible>
              <Alert.Title>Cannot rebase branch</Alert.Title>
              <Alert.Description>
                <p>{rebaseErrorMessage}</p>
              </Alert.Description>
            </Alert.Root>
          )}

          <PullRequestPanel {...panelProps} />
          <Spacer size={12} />

          <PullRequestFilters {...filtersProps} />
          <Spacer size={6} />

          <PullRequestOverview useTranslationStore={useTranslationStore} {...overviewProps} />
          <Spacer size={9} />

          <PullRequestCommentBox {...commentBoxProps} />
        </SandboxLayout.Content>
      </SandboxLayout.Column>

      <SandboxLayout.Column>
        <SandboxLayout.Content className="px-0 pt-0">
          <PullRequestSideBar useTranslationStore={useTranslationStore} {...sideBarProps} />
        </SandboxLayout.Content>
      </SandboxLayout.Column>
    </SandboxLayout.Columns>
  )
}
