import { ReactNode } from 'react'

import { Button, IconV2, Layout, ScrollArea, SearchFiles } from '@/components'

interface RepoSidebarProps {
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  branchSelectorRenderer: ReactNode
  repoRef?: string
}

export const RepoSidebar = ({
  navigateToNewFile,
  branchSelectorRenderer,
  navigateToFile,
  filesList,
  children,
  repoRef
}: RepoSidebarProps) => {
  return (
    <>
      <div className="repo-files-height sticky top-[var(--cn-page-nav-full-height)]">
        <Layout.Flex direction="column" className="pr-cn-lg pl-cn-2xl pt-cn-xl max-h-full overflow-hidden" gapY="sm">
          <Layout.Grid columns="1fr auto" flow="column" align="center" gapX="xs">
            {branchSelectorRenderer}
            <Button iconOnly variant="outline" aria-label="Create file" onClick={navigateToNewFile}>
              <IconV2 name="plus" className="text-icons-3" />
            </Button>
          </Layout.Grid>

          <SearchFiles
            navigateToFile={navigateToFile}
            filesList={filesList}
            searchInputSize="md"
            contentClassName="w-[800px]"
          />

          <ScrollArea
            className="pb-cn-xl -mr-5 grid-cols-[100%] pr-5"
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
