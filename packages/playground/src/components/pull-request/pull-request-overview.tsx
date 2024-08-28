import React from 'react'
import { Card, Text } from '@harnessio/canary'

// Define types for the props of TimelineItem component
interface TimelineItemProps {
  title: string
  description: string
  icon: React.ReactNode // Change type to React.ReactNode
}

// TimelineItem component to display individual timeline entries
const TimelineItem: React.FC<TimelineItemProps> = ({ title, description, icon }) => (
  <div className="grid items-center grid-cols-[30px_1fr] grid-rows-[auto_1fr] gap-x-3 gap-y-2">
    <div className="col-start-1 row-start-1">
      <div className="rounded-full flex place-content-center place-items-center p-1.5 border border-tertiary-background/50 text-primary">
        {icon} {/* Render the icon component */}
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
  </div>
)

// Define types for the data used in PullRequestOverview component
interface PullRequestOverviewProps {
  data: { title: string; description: string; icon: React.ReactNode }[] // Change type to include React.ReactNode
}

// PullRequestOverview component that uses TimelineItem to display a list
const PullRequestOverview: React.FC<PullRequestOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {data.map((item, index) => (
        <TimelineItem
          key={index}
          title={item.title}
          description={item.description}
          icon={item.icon} // Pass the icon component
        />
      ))}
    </div>
  )
}

export default PullRequestOverview
