import React from 'react'
import { Card, Input, NodeGroup, Text } from '@harnessio/canary'

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
  <NodeGroup.Root>
    <NodeGroup.Icon>{icon}</NodeGroup.Icon>
    <NodeGroup.Title>
      {/* Ensure that header has at least one item */}
      {header.length > 0 && <ItemHeader {...header[0]} />}
    </NodeGroup.Title>
    <NodeGroup.Content>
      {/* Remove h-32, only for show */}
      <Card className="bg-transparent rounded-md">
        <div className="flex h-32  px-4 py-4">
          <Text size={2} color="primary" className="hidden">
            {content}
          </Text>
        </div>
        <div className="flex items-center gap-3 border-t px-4 py-4">
          <div className='h-6 w-6 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
          <Input placeholder={'Reply here'} />
        </div>
      </Card>
    </NodeGroup.Content>
    {!isLast && <NodeGroup.Connector />}
  </NodeGroup.Root>
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
