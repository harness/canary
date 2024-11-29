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
import { SkeletonList } from '@harnessio/ui/components'

import { BranchSelector } from '../components/branch-chooser'
import { NoData } from '../components/no-data'
import { NoSearchResults } from '../components/no-search-results'
import { Summary } from '../components/repo-summary'
import { RepoSummaryPanel } from '../components/repo-summary-panel'
import { mockFiles } from '../data/mockSummaryFiiles'
import { Floating1ColumnLayout } from '../layouts/Floating1ColumnLayout'
import { FullWidth2ColumnLayout } from '../layouts/FullWidth2ColumnLayout'
import { PlaygroundListSettings } from '../settings/list-settings'

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

function RepoSummaryPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const renderListContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return (
          <Summary
            files={mockFiles}
            latestFile={pick(mockFiles[0], ['user', 'lastCommitMessage', 'timestamp', 'sha'])}
          />
        )
      case 'loading':
        return <SkeletonList />
      case 'no-search-matches':
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
          />
        )
      default:
        return null
    }
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData
          insideTabView
          iconName="no-data-folder"
          title="No files yet"
          description={['There are no files in this repository yet.', 'Create new or import an existing file.']}
          primaryButton={{ label: 'Create file' }}
          secondaryButton={{ label: 'Import file' }}
        />
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <Floating1ColumnLayout>
      <FullWidth2ColumnLayout
        leftColumn={
          <>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <ButtonGroup.Root>
                  <BranchSelector name={'main'} branchList={mockBranchList} selectBranch={noop} />
                  <SearchBox.Root placeholder="Search" />
                </ButtonGroup.Root>
              </ListActions.Left>
              <ListActions.Right>
                <ButtonGroup.Root>
                  <Button variant="outline">
                    Add file&nbsp;&nbsp;
                    <Icon name="chevron-down" size={11} className="chevron-down" />
                  </Button>
                  <Button variant="default">Clone repository</Button>
                </ButtonGroup.Root>
              </ListActions.Right>
            </ListActions.Root>
            <Spacer size={5} />
            {renderListContent()}
            <Spacer size={5} />
            <StackedList.Root>
              <StackedList.Item isHeader disableHover>
                <StackedList.Field title={<Text color="tertiaryBackground">README.md</Text>} />
              </StackedList.Item>
              <StackedList.Item disableHover>
                {/* Dummy WYSIWYG content */}
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
                    Below you will find some basic information about how to work with this project. If you&apos;ve
                    spotted a bug, a copywriting mistake or just want to suggest some better solution, please, refer to
                    the contribution section.
                  </Text>
                  <Text className="text-primary/80">
                    Hello there! This repo is a home to Pixel Point, a web agency that designs and develops world-class
                    marketing websites. We made this codebase available to open source community so everyone can get
                    something useful out of our expertise, be it for project structure, code patterns or plugins.
                  </Text>
                </div>
              </StackedList.Item>
            </StackedList.Root>
          </>
        }
        rightColumn={<RepoSummaryPanel title="Summary" timestamp={'May 6, 2024'} details={mockSummaryDetails} />}
      />
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </Floating1ColumnLayout>
  )
}

export default RepoSummaryPage
