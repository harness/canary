import React from 'react'
import { Card, Text } from '@harnessio/canary'

interface TimelineItemProps {
  header: {
    avatar?: React.ReactNode
    name?: string
    description?: string
  }[]
  content: string
  icon: React.ReactNode
  isLast: boolean
}

interface ItemHeaderProps {
  avatar?: React.ReactNode
  name?: string
  description?: string
}

// Use React.memo for performance optimization if appropriate
const ItemHeader: React.FC<ItemHeaderProps> = React.memo(({ avatar, name, description }) => (
  <div className="inline-flex gap-1.5 items-center">
    {avatar && <div>{avatar}</div>}
    {name && (
      <Text size={2} color="primary" weight="medium">
        {name}
      </Text>
    )}
    {description && (
      <Text size={2} color="tertiaryBackground">
        {description}
      </Text>
    )}
  </div>
))

const TimelineItem: React.FC<TimelineItemProps> = ({ header, content, icon, isLast }) => (
  <div className="relative grid items-center grid-cols-[26px_1fr] grid-rows-[auto_1fr] gap-x-3 gap-y-2 pb-8">
    <div className="col-start-1 row-start-1">
      <div className="relative z-20 h-6 w-6 rounded-full flex place-content-center place-items-center p-1 border border-tertiary-background/30 bg-background text-primary">
        {icon}
      </div>
    </div>
    <div className="col-start-2 row-start-1">
      {/* Ensure that header has at least one item */}
      {header.length > 0 && <ItemHeader {...header[0]} />}
    </div>
    <div className="col-start-2 row-start-2">
      {/* Remove h-32, only for show */}
      <Card className="bg-transparent rounded-md px-4 py-4 h-32">
        <Text size={2} color="primary" className="hidden">
          {content}
        </Text>
      </Card>
    </div>
    {!isLast && <div className="z-10 absolute left-[12px] top-0 bottom-0 w-[1px] border-l" />}
  </div>
)

interface PullRequestOverviewProps {
  data: {
    content: string
    icon: React.ReactNode
    header: {
      avatar?: React.ReactNode
      name?: string
      description?: string
    }[]
  }[]
}

const PullRequestOverview: React.FC<PullRequestOverviewProps> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <TimelineItem
          key={index} // Consider using a unique ID if available
          header={item.header}
          content={item.content}
          icon={item.icon}
          isLast={data.length - 1 === index}
        />
      ))}
    </div>
  )
}

export default PullRequestOverview
