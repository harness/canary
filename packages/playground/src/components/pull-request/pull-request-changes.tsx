import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, StackedList, Text } from '@harnessio/canary'
import React from 'react'

interface LineTitleProps {
  text?: string
}

interface DataProps {
  data: string[]
}

const LineTitle: React.FC<LineTitleProps> = ({ text }) => (
  <div className="inline-flex gap-2 items-center">
    <Text weight="medium">{text}</Text>
  </div>
)

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

export default function PullRequestChanges({ data }: DataProps) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <PullRequestAccordion key={index} title={item} />
      ))}
    </div>
  )
}
