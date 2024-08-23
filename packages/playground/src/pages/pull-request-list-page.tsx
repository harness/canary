import React from 'react'
import PullRequestList from '../components/pull-request/pull-request-list'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Icon,
  StackedList
} from '@harnessio/canary'
import PaddingListLayout from '../layouts/PaddingListLayout'

function PullRequestListPage() {
  return (
    <PaddingListLayout className="max-w-[860px]">
      <StackedList.Root className="border-none">
        <div className="flex">
          <div className="grid w-full grid-flow-col grid-cols-1 auto-cols-auto items-center gap-0">
            <StackedList.Item>
              <Input
                type="search"
                placeholder="Search ..."
                className="flex w-full mr-3 leading-4 rounded-lg bg-secondary-background placeholder:text-tertiary-background"
              />
            </StackedList.Item>
            <StackedList.Item>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="group text-tertiary-background select-none">
                  <Button variant="ghost" size="default" padding="sm" className="entity-list-action">
                    Filter&nbsp;
                    <Icon name="chevron-down" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-light text-xs">Filter option 1</DropdownMenuItem>
                  <DropdownMenuItem className="font-light text-xs">Filter option 2</DropdownMenuItem>
                  <DropdownMenuItem className="font-light text-xs">Filter option 3</DropdownMenuItem>
                  <DropdownMenuItem className="font-light text-xs">Filter option 4</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </StackedList.Item>
            <StackedList.Item>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="group text-tertiary-background select-none">
                  <Button variant="ghost" size="default" padding="sm" className="entity-list-action">
                    Sort&nbsp;
                    <Icon name="chevron-down" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-light text-xs">Sort option 1</DropdownMenuItem>
                  <DropdownMenuItem className="font-light text-xs">Sort option 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </StackedList.Item>
            <StackedList.Item>
              <Button variant="default" size="sm" className="ml-6">
                New Pull Request
              </Button>
            </StackedList.Item>
          </div>
        </div>
        <div className="flex">
          <PullRequestList />
        </div>
      </StackedList.Root>
    </PaddingListLayout>
  )
}

export default PullRequestListPage
