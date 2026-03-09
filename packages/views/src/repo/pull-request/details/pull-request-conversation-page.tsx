import { FC } from 'react'

import { Alert, Layout } from '@harnessio/ui/components'
import {
  PrincipalPropsType,
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
  SandboxLayout
} from '@views'
import { combineAndNormalizePrincipalsAndGroups } from '@views/repo/utils'
import { noop } from 'lodash-es'

import { ExpandedCommentsContext, useExpandedCommentsContext } from './context/pull-request-comments-context'

export interface PullRequestConversationPageProps {
  rebaseErrorMessage: string | null
  panelProps: PullRequestPanelProps
  filtersProps: PullRequestFilterProps<{ label: string; value: string }>
  overviewProps: Omit<PullRequestOverviewProps, 'principalProps'>
  commentBoxProps: Omit<PullRequestCommentBoxProps, 'principalProps'>
  sideBarProps: Omit<PullRequestSideBarProps, 'usersList' | 'searchQuery' | 'setSearchQuery'>
  principalProps: PrincipalPropsType
}

export const PullRequestConversationPage: FC<PullRequestConversationPageProps> = ({
  rebaseErrorMessage,
  panelProps,
  filtersProps,
  overviewProps,
  commentBoxProps,
  sideBarProps,
  principalProps
}) => {
  const contextValue = useExpandedCommentsContext()

  return (
    <ExpandedCommentsContext.Provider value={contextValue}>
      <SandboxLayout.Columns columnWidths="minmax(calc(100% - 334px), 1fr) 334px" className="mt-cn-xl">
        <SandboxLayout.Column>
          <SandboxLayout.Content className="pr-cn-xl pl-0 pt-0">
            {/*TODO: update with design  */}
            {!!rebaseErrorMessage && (
              <Alert.Root theme="danger" className="mb-cn-lg" dismissible>
                <Alert.Title>Cannot rebase branch</Alert.Title>
                <Alert.Description>
                  <p>{rebaseErrorMessage}</p>
                </Alert.Description>
              </Alert.Root>
            )}

            <PullRequestPanel {...panelProps} className="mb-cn-3xl" />

            <Layout.Vertical gapY="lg">
              <PullRequestFilters {...filtersProps} />

              <PullRequestOverview {...overviewProps} principalProps={principalProps} />

              <PullRequestCommentBox {...commentBoxProps} principalProps={principalProps} />
            </Layout.Vertical>
          </SandboxLayout.Content>
        </SandboxLayout.Column>

        <SandboxLayout.Column>
          <PullRequestSideBar
            {...sideBarProps}
            isReviewersLoading={principalProps?.isPrincipalsLoading}
            searchQuery={principalProps?.searchPrincipalsQuery || ''}
            setSearchQuery={principalProps?.setSearchPrincipalsQuery || noop}
            usersList={combineAndNormalizePrincipalsAndGroups(
              principalProps?.principals ?? [],
              principalProps?.userGroups ?? []
            )}
          />
        </SandboxLayout.Column>
      </SandboxLayout.Columns>
    </ExpandedCommentsContext.Provider>
  )
}
PullRequestConversationPage.displayName = 'PullRequestConversationPage-UI'
