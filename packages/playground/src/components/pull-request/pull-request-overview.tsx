import React from 'react'
import { Card, Text } from '@harnessio/canary'

interface TimelineItemProps {
  title: string
  description: string
  icon: React.ReactNode
  isLast: boolean
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, description, icon, isLast }) => (
  <div className="relative grid items-center grid-cols-[26px_1fr] grid-rows-[auto_1fr] gap-x-3 gap-y-2 pb-8">
    <div className="col-start-1 row-start-1">
      <div className="relative z-20 rounded-full flex place-content-center place-items-center p-1 border border-tertiary-background/30 bg-background text-primary">
        {icon}
      </div>
    </div>
    <div className="col-start-2 row-start-1">
      <Text size={2} color="tertiaryBackground">
        {title}
      </Text>
    </div>
    <div className="col-start-2 row-start-2">
      <Card className="bg-transparent rounded-md px-4 py-4">
        <Text size={2} color="tertiaryBackground">
          {description}
        </Text>
      </Card>
    </div>
    {!isLast && <div className="z-10 absolute left-[13px] top-0 bottom-0 w-[1px] border-l" />}
  </div>
)

interface PullRequestOverviewProps {
  data: { title: string; description: string; icon: React.ReactNode }[]
}

const PullRequestOverview: React.FC<PullRequestOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-0">
      {data.map((item, index) => (
        <TimelineItem
          key={index}
          title={item.title}
          description={item.description}
          icon={item.icon}
          isLast={data.length - 1 === index}
        />
      ))}
    </div>
  )
}

export default PullRequestOverview
