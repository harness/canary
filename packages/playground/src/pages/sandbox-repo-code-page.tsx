import { useState } from 'react'
import { Link } from 'react-router-dom'

import { noop, pick } from 'lodash-es'

import { Button, ButtonGroup, Icon, ListActions, Spacer, Text } from '@harnessio/canary'

import { FileExplorer, SandboxLayout } from '..'
import { BranchSelector } from '../components/branch-chooser'
import { Summary } from '../components/repo-summary'
import { SearchFiles } from '../components/search-files'
import { mockFiles } from '../data/mockSummaryFiiles'
import { PlaygroundSandboxLayoutSettings } from '../settings/sandbox-settings'

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

const filesListItems = [
  'index.html',
  'App.js',
  'README.md',
  'package-1239568483438.json',
  'webpack.config.js',
  'babel.config.js',
  'tsconfig.json',
  'prettier.config.js',
  'Dockerfile'
]

// Move sidebar function to playground components
function Sidebar() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid w-full auto-cols-auto grid-flow-col grid-cols-[1fr] items-center gap-3">
        <BranchSelector size="sm" name="main" branchList={mockBranchList} selectBranch={noop} width="full" />
        <ButtonGroup.Root
          spacing="0"
          className="h-full overflow-hidden rounded-md shadow-[inset_0_0_0_1px] shadow-border"
        >
          <Button size="sm" variant="ghost" className="w-8 rounded-none p-0">
            <Icon size={15} name="add-folder" className="text-primary/80" />
          </Button>
          <Button size="sm" variant="ghost" borderRadius="0" className="w-8 rounded-none border-l p-0">
            <Icon size={15} name="add-file" className="text-primary/80" />
          </Button>
        </ButtonGroup.Root>
      </div>
      <SearchFiles navigateToFile={noop} filesList={filesListItems} />
      <FileExplorer.Root onValueChange={noop} value={[]}>
        {/* 2 nested levels of identical data for demo purposes */}
        {sidebarItems.map(item =>
          item.type === 'file' ? (
            <Link to="#" key={item.id}>
              <FileExplorer.FileItem key={item.id.toString()} link="">
                {item.name}
              </FileExplorer.FileItem>
            </Link>
          ) : (
            <FileExplorer.FolderItem
              key={item.id.toString()}
              value={item.id.toString()}
              link=""
              // isActive={item_idx === 3}
              content={
                <FileExplorer.Root onValueChange={noop} value={[]}>
                  {sidebarItems.map(item =>
                    item.type === 'file' ? (
                      <Link to="#" key={item.id}>
                        <FileExplorer.FileItem key={item.id.toString()} link="">
                          {item.name}
                        </FileExplorer.FileItem>
                      </Link>
                    ) : (
                      <FileExplorer.FolderItem
                        key={item.id.toString()}
                        value={item.id.toString()}
                        link=""
                        content={
                          <FileExplorer.Root onValueChange={noop} value={[]}>
                            {sidebarItems.map(item =>
                              item.type === 'file' ? (
                                <Link to="#" key={item.id}>
                                  <FileExplorer.FileItem key={item.id.toString()} link="">
                                    {item.name}
                                  </FileExplorer.FileItem>
                                </Link>
                              ) : (
                                <FileExplorer.FolderItem key={item.id.toString()} value={item.id.toString()} link="">
                                  {item.name}
                                </FileExplorer.FolderItem>
                              )
                            )}
                          </FileExplorer.Root>
                        }
                      >
                        {item.name}
                      </FileExplorer.FolderItem>
                    )
                  )}
                </FileExplorer.Root>
              }
            >
              {item.name}
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
        hasSubHeader
      >
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
