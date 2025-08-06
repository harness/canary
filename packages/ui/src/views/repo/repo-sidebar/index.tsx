import { ReactNode } from 'react'

import { Button, IconV2, Layout, ScrollArea, SearchFiles, Spacer } from '@/components'

interface RepoSidebarProps {
  navigateToNewFile: () => void
  navigateToFile: (file: string) => void
  filesList?: string[]
  children: ReactNode
  branchSelectorRenderer: ReactNode
}

export const RepoSidebar = ({
  navigateToNewFile,
  branchSelectorRenderer,
  navigateToFile,
  filesList,
  children
}: RepoSidebarProps) => {
  return (
    <>
      <div className="repo-files-height sticky top-[var(--cn-page-nav-full-height)]">
        <Layout.Flex direction="column" className="max-h-full overflow-hidden px-5 pt-7" gapY="sm">
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
            contentClassName="w-[280px]"
          />

          <ScrollArea className="-mr-5 grid-cols-[100%] pr-5">
            {children}
            <Spacer size={10} />
          </ScrollArea>
        </Layout.Flex>
      </div>
    </>
  )
}
