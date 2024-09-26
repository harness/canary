import React, { useState } from 'react'
import { noop, pick } from 'lodash-es'
import { Spacer, ListActions, Button, Text, Icon, ButtonGroup, SearchBox } from '@harnessio/canary'
import { Summary } from '../components/repo-summary'
import { BranchSelector } from '../components/branch-chooser'
import { mockFiles } from '../data/mockSummaryFiiles'
import { SandboxLayout, FileExplorer } from '..'
import { PlaygroundSandboxLayoutSettings } from '../settings/sandbox-settings'
import { Link } from 'react-router-dom'

const mockBranchList = [
  {
    name: 'main'
  },
  {
    name: 'new-feature'
  },
  {
    name: 'test-wip'
  },
  {
    name: 'display-db'
  }
]

const sidebarItems = [
  { id: 0, type: 'folder', name: 'public' },
  { id: 1, type: 'folder', name: 'build' },
  { id: 2, type: 'folder', name: 'assets' },
  { id: 3, type: 'folder', name: 'src' },
  { id: 4, type: 'folder', name: 'utils-and-tools-misc-2024' },
  { id: 5, type: 'folder', name: 'hooks' },
  { id: 6, type: 'folder', name: 'styles' },
  { id: 7, type: 'folder', name: 'config' },
  { id: 8, type: 'file', name: 'index.html' },
  { id: 9, type: 'file', name: 'index.js' },
  { id: 10, type: 'file', name: 'App.js' },
  { id: 11, type: 'file', name: 'README.md' },
  { id: 12, type: 'file', name: 'package-1239568483438.json' },
  { id: 13, type: 'file', name: 'webpack.config.js' },
  { id: 14, type: 'file', name: '.eslintrc.js' },
  { id: 15, type: 'file', name: '.gitignore' },
  { id: 16, type: 'file', name: 'babel.config.js' },
  { id: 17, type: 'file', name: 'tailwind.config.js' },
  { id: 18, type: 'file', name: 'postcss.config.js' },
  { id: 19, type: 'file', name: 'LICENSE' },
  { id: 20, type: 'file', name: 'tsconfig.json' },
  { id: 21, type: 'file', name: 'jest.config.js' },
  { id: 22, type: 'file', name: 'next.config.js' },
  { id: 23, type: 'file', name: 'commitlint.config.js' },
  { id: 24, type: 'file', name: 'prettier.config.js' },
  { id: 25, type: 'file', name: 'stylelint.config.js' },
  { id: 26, type: 'file', name: 'nodemon.json' },
  { id: 27, type: 'file', name: 'docker-compose.yml' },
  { id: 28, type: 'file', name: 'Dockerfile' },
  { id: 29, type: 'file', name: 'yarn.lock' },
  { id: 30, type: 'file', name: 'pnpm-lock.yaml' },
  { id: 31, type: 'file', name: '.editorconfig' },
  { id: 32, type: 'file', name: '.npmrc' },
  { id: 33, type: 'file', name: '.nvmrc' },
  { id: 34, type: 'file', name: 'server.js' },
  { id: 35, type: 'file', name: 'database.json' },
  { id: 36, type: 'file', name: 'CONTRIBUTING.md' },
  { id: 38, type: 'file', name: '.env.example' },
  { id: 39, type: 'file', name: '.env.local' },
  { id: 40, type: 'file', name: 'nginx.conf' }
]

// Move sidebar function to playground components
function Sidebar() {
  return (
    <div className="flex flex-col gap-5">
      <div className="w-full grid grid-cols-[1fr] auto-cols-auto grid-flow-col gap-3 items-center">
        <BranchSelector size="sm" name="main" branchList={mockBranchList} selectBranch={noop} />
        <ButtonGroup.Root
          spacing="0"
          className="shadow-border shadow-[inset_0_0_0_1px] rounded-md h-full overflow-hidden">
          <Button size="sm" variant="ghost" className="rounded-none p-0 w-8">
            <Icon size={15} name="add-folder" className="text-primary/80" />
          </Button>
          <Button size="sm" variant="ghost" borderRadius="0" className="border-l rounded-none p-0 w-8">
            <Icon size={15} name="add-file" className="text-primary/80" />
          </Button>
        </ButtonGroup.Root>
      </div>
      <SearchBox.Root width="full" placeholder="Search" />
      <FileExplorer.Root>
        {/* 2 nested levels of identical data for demo purposes */}
        {sidebarItems.map((itm, itm_idx) =>
          itm.type === 'file' ? (
            <Link to="#">
              <FileExplorer.FileItem key={itm.id.toString()}>{itm.name}</FileExplorer.FileItem>
            </Link>
          ) : (
            <FileExplorer.FolderItem
              key={itm.id.toString()}
              value={itm.id.toString()}
              isActive={itm_idx === 3}
              content={
                <FileExplorer.Root>
                  {sidebarItems.map(itm =>
                    itm.type === 'file' ? (
                      <Link to="#">
                        <FileExplorer.FileItem key={itm.id.toString()}>{itm.name}</FileExplorer.FileItem>
                      </Link>
                    ) : (
                      <FileExplorer.FolderItem
                        key={itm.id.toString()}
                        value={itm.id.toString()}
                        content={
                          <FileExplorer.Root>
                            {sidebarItems.map(itm =>
                              itm.type === 'file' ? (
                                <Link to="#">
                                  <FileExplorer.FileItem key={itm.id.toString()}>{itm.name}</FileExplorer.FileItem>
                                </Link>
                              ) : (
                                <FileExplorer.FolderItem key={itm.id.toString()} value={itm.id.toString()}>
                                  {itm.name}
                                </FileExplorer.FolderItem>
                              )
                            )}
                          </FileExplorer.Root>
                        }>
                        {itm.name}
                      </FileExplorer.FolderItem>
                    )
                  )}
                </FileExplorer.Root>
              }>
              {itm.name}
            </FileExplorer.FolderItem>
          )
        )}
      </FileExplorer.Root>
    </div>
  )
}

function SandboxRepoCodePage() {
  const [loadState, setLoadState] = useState('full-sub')

  return (
    <>
      {loadState.includes('sub') && (
        <SandboxLayout.LeftSubPanel hasHeader hasSubHeader>
          <SandboxLayout.Content>
            <Sidebar />
          </SandboxLayout.Content>
        </SandboxLayout.LeftSubPanel>
      )}
      <SandboxLayout.Main
        fullWidth={loadState.includes('full')}
        hasLeftPanel
        hasLeftSubPanel={loadState.includes('sub')}
        hasHeader
        hasSubHeader>
        <SandboxLayout.Content>
          <ListActions.Root>
            <ListActions.Left>
              <ButtonGroup.Root spacing="2">
                <Text size={2} color="tertiaryBackground">
                  drone
                </Text>
                <Text size={2} color="tertiaryBackground">
                  /
                </Text>
                <Text size={2} color="primary" weight="medium">
                  src
                </Text>
              </ButtonGroup.Root>
            </ListActions.Left>
            <ListActions.Right>
              <Button variant="outline" size="sm">
                Add file&nbsp;&nbsp;
                <Icon name="chevron-down" size={11} className="chevron-down" />
              </Button>
            </ListActions.Right>
          </ListActions.Root>
          <Spacer size={5} />
          <Summary
            files={mockFiles}
            latestFile={pick(mockFiles[0], ['user', 'lastCommitMessage', 'timestamp', 'sha'])}
          />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
      <PlaygroundSandboxLayoutSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}

export { SandboxRepoCodePage }
