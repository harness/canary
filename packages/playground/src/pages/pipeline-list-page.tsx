import React from 'react'
import {
  Text,
  Spacer,
  ListActions,
  ListPagination,
  Button,
  SearchBox,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext
} from '@harnessio/canary'
import PipelineList from '../components/pipeline-list'
import PaddingListLayout from '../layouts/PaddingListLayout'

const mockPipelines = [
  {
    id: '1',
    success: true,
    name: 'TI v2 - Build jhttp - cloud',
    sha: '93dbd09a',
    description: 'fix(deps): update module github.com/aws/aws-sdk-go to',
    version: 'v1.5.4.20',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    success: true,
    name: 'Zuul Cloud',
    sha: '366177a6',
    description: 'Update module github.com/aws/aws-sdk-go to',
    version: 'v1.54.19',
    timestamp: '3 hours ago'
  },
  {
    id: '3',
    success: true,
    name: 'Zuul K8S',
    sha: 'da7c1c67',
    description: 'feat: [CDE-119]: Add task handling to spawn and cleanup VM for CDE/gitspaces on bare metalo',
    version: 'v1.5.4.20',
    timestamp: '5 hours ago'
  },
  {
    id: '4',
    success: true,
    name: 'build scan push K8S - Trivy',
    sha: '93dbd09a',
    description: 'fix: [CI-13371]: Fix log closers in case of step timeouts',
    version: 'v1.5.4.20',
    timestamp: '5 hours ago'
  },

  {
    id: '5',
    success: false,
    name: 'build scan push test - k8s - Clone 2',
    sha: 'fe54f9b1',
    description: 'Update go-jsonnet version to',
    version: 'v0.20.0',
    timestamp: '13 hours ago'
  },
  {
    id: '6',
    success: true,
    name: 'build scan push test - cloud',
    sha: 'b7765ad1',
    description: 'update google/go-jsonnet version to',
    version: 'v0.20.0',
    timestamp: '14 hours ago'
  },
  {
    id: '7',
    success: false,
    name: 'build scan push test - k8s',
    sha: 'cf5f4b4a',
    description: 'fix: [CI-11759]: Fixing sum for Harness code',
    version: 'v1.5.4.20',
    timestamp: '15 hours ago'
  },
  {
    id: '8',
    success: true,
    name: 'build scan push test - k8s - Clone',
    sha: 'da7c1c67',
    description: 'fix: [CI-13371]: Fix log closers in case of step timeouts',
    version: 'v1.5.4.20',
    timestamp: '16 hours ago'
  }
]

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

function PipelineListPage() {
  return (
    //Wrapper component for padding and list layout-Jessie
    <PaddingListLayout>
      <Text size={5} weight={'medium'}>
        Pipelines
      </Text>
      <Spacer size={6} />
      <ListActions.Root>
        <ListActions.Left>
          <SearchBox.Root placeholder="Search" />
        </ListActions.Left>
        <ListActions.Right>
          <ListActions.Dropdown title="Filter" items={filterOptions} />
          <ListActions.Dropdown title="Sort" items={sortOptions} />
          <ListActions.Dropdown title="View" items={viewOptions} />
          <Button variant="default">Create Pipeline</Button>
        </ListActions.Right>
      </ListActions.Root>
      <Spacer size={5} />
      <PipelineList pipelines={mockPipelines} />
      <Spacer size={8} />
      <ListPagination.Root>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious size="sm" href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive size="sm_icon" href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="sm_icon" href="#">
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink size="sm_icon" href="#">
                <PaginationEllipsis />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="sm_icon" href="#">
                4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="sm_icon" href="#">
                5
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext size="sm" href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ListPagination.Root>
    </PaddingListLayout>
  )
}

export default PipelineListPage
