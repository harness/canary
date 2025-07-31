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
      <div className="nested-sidebar-height sticky top-[var(--cn-page-nav-height)]">
        <Layout.Flex direction="column" className="max-h-full overflow-hidden px-5 pt-7" gapY="sm">
          <Layout.Grid columns="1fr auto" flow="column" align="center" gapX="xs" className="">
            {branchSelectorRenderer}
            <Button iconOnly variant="outline" aria-label="Create file" onClick={navigateToNewFile}>
              <IconV2 name="plus" className="text-icons-3" />
            </Button>
          </Layout.Grid>

          <SearchFiles
            navigateToFile={navigateToFile}
            filesList={filesList}
            searchInputSize="md"
            inputContainerClassName=""
          />

          <ScrollArea className="-mr-5 grid-cols-[100%] pr-5" classNameContent="w-[210px]">
            {children}
            <Spacer size={10} />
          </ScrollArea>
        </Layout.Flex>
      </div>
      {/* Sticky right border */}
      <div className="border-cn-borders-4 sticky top-0 w-px border-r" />
    </>
  )
}
