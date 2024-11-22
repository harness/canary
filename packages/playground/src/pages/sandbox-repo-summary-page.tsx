import { useState } from 'react'

import { noop, pick } from 'lodash-es'

import {
  Button,
  ButtonGroup,
  Icon,
  IconProps,
  ListActions,
  SearchBox,
  Spacer,
  StackedList,
  Text
} from '@harnessio/canary'

import { SandboxLayout } from '..'
import { BranchSelector, BranchSelectorBranchProps } from '../components/branch-selector'
import { CloneRepoDialog } from '../components/repo-clone/clone-repo-dialog'
import { FileProps, Summary } from '../components/repo-summary'
import { RepoSummaryPanel } from '../components/repo-summary-panel'
import { mockBranchData } from '../data/mockBranchData'
import { mockFiles } from '../data/mockSummaryFiiles'
import { PlaygroundSandboxLayoutSettings } from '../settings/sandbox-settings'

// TODO: Move LAYOUT_STATES and LayoutState type to a shared location (e.g., types/layouts.ts)
// since these states are used across multiple pages and should be managed in a single place
// for better maintainability and consistency
const LAYOUT_STATES = {
  float: 'float',
  sub: 'sub',
  full: 'full'
} as const

type LayoutState = (typeof LAYOUT_STATES)[keyof typeof LAYOUT_STATES]

const mockSummaryDetails: { id: string; name: string; count: number; iconName: IconProps['name'] }[] = [
  {
    id: '0',
    name: 'Commits',
    count: 594,
    iconName: 'tube-sign'
  },
  {
    id: '1',
    name: 'Branches',
    count: 27,
    iconName: 'branch'
  },
  {
    id: '2',
    name: 'Tags',
    count: 69,
    iconName: 'tag'
  },
  {
    id: '3',
    name: 'Open pull requests',
    count: 0,
    iconName: 'open-pr'
  }
]

const mockBranchList = {
  branches: {
    items: mockBranchData,
    viewAllUrl: '#'
  },
  tags: {
    items: [
      {
        name: 'v1.0.0'
      },
      {
        name: 'v1.0.1'
      },
      {
        name: 'v1.0.2'
      }
    ],
    viewAllUrl: '#'
  }
}

function SandboxRepoSummaryPage() {
  const [loadState, setLoadState] = useState<LayoutState | string>(LAYOUT_STATES.float)
  const [selectedBranch, setSelectedBranch] = useState<BranchSelectorBranchProps | { name: string }>(
    mockBranchList.branches.items[0]
  )

  return (
    <>
      {loadState.includes(LAYOUT_STATES.sub) && (
        <SandboxLayout.LeftSubPanel hasHeader hasSubHeader>
          <SandboxLayout.Content>
            <Text as="p" size={2} className="text-primary/70">
              SubMenu
            </Text>
            <Text as="p" size={2} className="text-primary/70">
              2,000 pixels tall
            </Text>
            <div className="h-[2000px]" />
            <Text as="p" size={2} className="text-primary/70">
              End of SubMenu
            </Text>
          </SandboxLayout.Content>
        </SandboxLayout.LeftSubPanel>
      )}
      <SandboxLayout.Main
        fullWidth={loadState.includes(LAYOUT_STATES.full)}
        hasLeftPanel
        hasLeftSubPanel={loadState.includes(LAYOUT_STATES.sub)}
        hasHeader
        hasSubHeader
      >
        <SandboxLayout.Columns columnWidths="1fr 220px">
          <SandboxLayout.Column>
            <SandboxLayout.Content>
              <ListActions.Root>
                <ListActions.Left>
                  <ButtonGroup.Root className="w-full">
                    <BranchSelector
                      className="w-full max-w-[8.5rem]"
                      name={selectedBranch.name}
                      branchList={mockBranchList.branches}
                      tagList={mockBranchList.tags}
                      selectBranch={setSelectedBranch}
                    />
                    <SearchBox.Root className="max-w-80" width="full" placeholder="Search" />
                  </ButtonGroup.Root>
                </ListActions.Left>
                <ListActions.Right>
                  <ButtonGroup.Root>
                    <Button variant="outline">
                      Add file&nbsp;&nbsp;
                      <Icon name="chevron-down" size={11} className="chevron-down" />
                    </Button>
                    <CloneRepoDialog
                      sshUrl="ssh://git@localhost:3022/sample-proj/sample-repo.git"
                      httpsUrl="http://localhost:3000/git/sample-proj/sample-repo.git"
                      handleCreateToken={noop}
                    />
                  </ButtonGroup.Root>
                </ListActions.Right>
              </ListActions.Root>
              <Spacer size={5} />
              <Summary
                files={mockFiles as FileProps[]}
                latestFile={pick(mockFiles[0], ['user', 'lastCommitMessage', 'timestamp', 'sha'])}
              />
              <Spacer size={5} />
              <StackedList.Root>
                <StackedList.Item isHeader disableHover>
                  <StackedList.Field title={<Text color="tertiaryBackground">README.md</Text>} />
                </StackedList.Item>
                <StackedList.Item disableHover>
                  <div className="flex flex-col gap-4 px-3 py-2">
                    <Text size={5} weight="medium">
                      Pixel Point — Web Design and Development
                    </Text>
                    <Text size={3}>Table of Contents</Text>
                    <ul className="flex flex-col gap-1">
                      <li>
                        <Text weight="normal" className="text-primary/80">
                          - Welcome
                        </Text>
                      </li>
                      <li>
                        <Text weight="normal" className="text-primary/80">
                          - Getting started
                        </Text>
                      </li>
                      <li>
                        <Text weight="normal" className="text-primary/80">
                          - Usage
                        </Text>
                      </li>
                    </ul>
                    <Text size={3} weight="medium">
                      Welcome
                    </Text>
                    <Text className="text-primary/80">
                      Below you will find some basic information about how to work with this project. If you`&apos;ve
                      spotted a bug, a copywriting mistake or just want to suggest some better solution, please, refer
                      to the contribution section.
                    </Text>
                    <Text className="text-primary/80">
                      Hello there! This repo is a home to Pixel Point, a web agency that designs and develops
                      world-class marketing websites. We made this codebase available to open source community so
                      everyone can get something useful out of our expertise, be it for project structure, code patterns
                      or plugins.
                    </Text>
                  </div>
                </StackedList.Item>
              </StackedList.Root>
            </SandboxLayout.Content>
          </SandboxLayout.Column>
          <SandboxLayout.Column>
            <SandboxLayout.Content className="pl-0">
              <RepoSummaryPanel title="Summary" timestamp={'May 6, 2024'} details={mockSummaryDetails} />
            </SandboxLayout.Content>
          </SandboxLayout.Column>
        </SandboxLayout.Columns>
      </SandboxLayout.Main>

      <PlaygroundSandboxLayoutSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}

export { SandboxRepoSummaryPage }
