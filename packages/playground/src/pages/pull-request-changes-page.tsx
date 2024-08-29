import React, { useState } from 'react'
import PlaygroundPullRequestChangesSettings from '../components/playground/pull-request-changes-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-data'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  Text,
  ListActions,
  Spacer,
  SplitButton,
  StackedList,
  AccordionContent
} from '@harnessio/canary'

interface LineTitleProps {
  text?: string
}

const LineTitle: React.FC<LineTitleProps> = ({ text }) => (
  <div className="inline-flex gap-2 items-center">
    <Text weight="medium">{text}</Text>
  </div>
)

const FilterSortViewDropdowns: React.FC = () => {
  const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
  const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
  const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

  return (
    <ListActions.Root>
      <ListActions.Left>
        <ListActions.Dropdown title="All commits" items={filterOptions} />
        <ListActions.Dropdown title="File filter" items={sortOptions} />
        <ListActions.Dropdown title="View" items={viewOptions} />
      </ListActions.Left>
      <ListActions.Right>
        <SplitButton variant="outline" size="sm">
          Approve
        </SplitButton>
      </ListActions.Right>
    </ListActions.Root>
  )
}

const PullRequestAccordion: React.FC<{ title: string }> = ({ title }) => (
  <StackedList.Root>
    <StackedList.Item isHeader className="p-0 hover:bg-transparent cursor-default">
      <Accordion type="multiple" className="w-full">
        <AccordionItem isLast value={title}>
          <AccordionTrigger leftChevron className="text-left p-4">
            <AccordionItem isLast value={title}></AccordionItem>
            <StackedList.Field title={<LineTitle text={title} />} />
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex border-t w-full h-32 p-4"></div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StackedList.Item>
  </StackedList.Root>
)

export default function PullRequestChangesPage() {
  const [loadState, setLoadState] = useState('data-loaded') // Change to data-loaded when component work is finished

  const pullRequestData = [
    'All checks have succeeded',
    'New commit pushed',
    'Conflicts resolved',
    'All checks have succeeded',
    'New commit pushed',
    'Conflicts resolved',
    'All checks have succeeded',
    'New commit pushed',
    'Conflicts resolved'
  ]

  if (loadState == 'loading') {
    return <SkeletonList />
  }

  if (loadState == 'no-data') {
    return (
      <NoData
        iconName="no-data-folder"
        title="No changes yet"
        description={['There are no changes for this pull request yet.']}
      />
    )
  }

  if (loadState == 'data-loaded') {
    return (
      <>
        <FilterSortViewDropdowns />
        <Spacer aria-setsize={5} />
        <div className="flex flex-col gap-4">
          {pullRequestData.map((item, index) => (
            <PullRequestAccordion key={index} title={item} />
          ))}
        </div>
        <Spacer size={5} />
        <PlaygroundPullRequestChangesSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return null
}
