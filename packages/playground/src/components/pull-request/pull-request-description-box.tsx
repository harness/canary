import React from 'react'
import PullRequestTimelineItem from './pull-request-timeline-item'
import { Icon, Text } from '@harnessio/canary'
import moment from 'moment'
import { MarkdownViewer } from '../markdown-viewer'

interface PullRequestDescBoxProps {
  isLast: boolean
  author?: string
  prNum?: string
  createdAt?: number
  description?: string
}

const PullRequestDescBox: React.FC<PullRequestDescBoxProps> = ({ isLast, author, prNum, createdAt, description }) => {
  const parsedDate = moment(createdAt)

  // Format the parsed date as relative time from now
  const formattedTime = parsedDate.fromNow()
  return (
    <PullRequestTimelineItem
      icon={<Icon name="pr-open" size={12} />}
      isLast={isLast}
      header={[
        {
          avatar: (
            <>
              <div className="h-6 w-6 rounded-full bg-tertiary-background  bg-cover"></div>{' '}
            </>
          ),
          name: author,
          // TODO: make pr num clickable?
          description: (
            <Text size={2} className="gap-x-2" color="tertiaryBackground">
              {`created pull request`}
              <Text size={2} className="pl-1">
                {prNum}{' '}
              </Text>
              {formattedTime}
            </Text>
          )
        }
      ]}
      hideReply
      contentClassName="pb-0"
      content={
        <div className="flex py-4 px-4">
          <Text size={2} color="primary">
            {description && <MarkdownViewer source={description} />}
          </Text>
        </div>
      }
      key={`description`}
    />
  )
}

export default PullRequestDescBox
