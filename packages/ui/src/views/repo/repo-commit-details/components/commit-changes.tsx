import { FC, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  CopyButton,
  StackedList
} from '@/components'
import { TranslationStore } from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import PullRequestDiffViewer from '@views/repo/pull-request/components/pull-request-diff-viewer'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { parseStartingLineIfOne } from '@views/repo/pull-request/utils'

interface HeaderProps {
  text: string
  numAdditions?: number
  numDeletions?: number
  data?: string
  title: string
  lang: string
  fileViews?: Map<string, string>
  checksumAfter?: string
  filePath: string
}

interface LineTitleProps {
  useTranslationStore: () => TranslationStore
  header: HeaderProps
}

interface DataProps {
  data: HeaderProps[]
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
}

const LineTitle: FC<LineTitleProps> = ({ header, useTranslationStore }) => {
  const { t: _t } = useTranslationStore()
  const { text, numAdditions, numDeletions } = header
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2">
        <span className="text-14 font-medium">{text}</span>
        <CopyButton name={text} className="text-icons-1" />
        {!!numAdditions && (
          <Badge variant="outline" size="sm" theme="success">
            +{numAdditions}
          </Badge>
        )}
        {!!numDeletions && (
          <Badge variant="outline" size="sm" theme="destructive">
            -{numDeletions}
          </Badge>
        )}
      </div>
    </div>
  )
}

const CommitsAccordion: FC<{
  header: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
}> = ({ header, diffMode, useTranslationStore }) => {
  const { highlight, wrap, fontsize } = useDiffConfig()

  const startingLine = parseStartingLineIfOne(header?.data ?? '')

  const [openItems, setOpenItems] = useState<string[]>([])

  return (
    <StackedList.Root>
      <StackedList.Item disableHover isHeader className="cursor-default p-0 hover:bg-transparent">
        <Accordion
          type="multiple"
          className="w-full"
          value={openItems}
          onValueChange={val => setOpenItems(val as string[])}
        >
          <AccordionItem isLast value={header.text}>
            <AccordionTrigger leftChevron className="p-4 text-left">
              <StackedList.Field title={<LineTitle useTranslationStore={useTranslationStore} header={header} />} />
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex w-full border-t">
                <div className="bg-transparent">
                  {startingLine ? (
                    <div className="bg-[--diff-hunk-lineNumber--]">
                      <div className="ml-16 w-full px-2 py-1 font-mono">{startingLine}</div>
                    </div>
                  ) : null}
                  <PullRequestDiffViewer
                    data={header?.data}
                    fontsize={fontsize}
                    highlight={highlight}
                    mode={diffMode}
                    wrap={wrap}
                    addWidget
                    fileName={header.title}
                    lang={header.lang}
                    useTranslationStore={useTranslationStore}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </StackedList.Item>
    </StackedList.Root>
  )
}

export function CommitChanges({ data, diffMode, useTranslationStore }: DataProps) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => {
        return (
          <CommitsAccordion
            key={`${item.title}-${index}`}
            header={item}
            diffMode={diffMode}
            useTranslationStore={useTranslationStore}
          />
        )
      })}
    </div>
  )
}
