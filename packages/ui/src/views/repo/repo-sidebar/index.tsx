import { ReactNode } from 'react'

import { Button, IconV2, Layout, ScrollArea, SearchFiles } from '@/components'

interface RepoSidebarProps {
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  branchSelectorRenderer: ReactNode
  repoRef?: string
  isRepoEmpty?: boolean
}

export const RepoSidebar = ({
  navigateToNewFile,
  branchSelectorRenderer,
  navigateToFile,
  filesList,
  children,
  repoRef,
  isRepoEmpty = false
}: RepoSidebarProps) => {
  return (
    <>
      <div className="repo-files-height sticky top-[var(--cn-page-nav-full-height)]">
        <Layout.Flex direction="column" className="pr-cn-sm pl-cn-2xl pt-cn-xl max-h-full overflow-hidden" gapY="sm">
          <Layout.Grid columns="1fr auto" flow="column" align="center" gapX="xs">
            {branchSelectorRenderer}
            {!isRepoEmpty && (
              <Button
                iconOnly
                variant="outline"
                tooltipProps={{
                  content: 'Create file'
                }}
                aria-label="Create file"
                onClick={navigateToNewFile}
              >
                <IconV2 name="plus" />
              </Button>
            )}
          </Layout.Grid>

          <SearchFiles navigateToFile={navigateToFile} filesList={filesList} />

          <ScrollArea
            className="pb-cn-xl pr-cn-sm -mr-cn-sm grid-cols-[100%]"
            preserveScrollPosition={true}
            storageKey={repoRef ? `fileExplorer_${repoRef}` : undefined}
          >
            {children}
          </ScrollArea>
        </Layout.Flex>
      </div>
    </>
  )
}
