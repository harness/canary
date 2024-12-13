import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Checkbox,
  CopyButton,
  StackedList,
  Text
} from '@components/index'
import { DiffModeEnum } from '@git-diff-view/react'
import { TranslationStore } from '@views/index'
import PullRequestDiffViewer from '@views/repo/pull-request/diff-viewer/pull-request-diff-viewer'
// import { FileViewGauge } from '@harnessio/views'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { parseStartingLineIfOne } from '@views/repo/pull-request/utils'

interface HeaderProps {
  text: string
  numAdditions?: number
  numDeletions?: number
  data?: string
  title: string
  lang: string
}

interface LineTitleProps {
  useTranslationStore: () => TranslationStore
  text: string
  numAdditions?: number
  numDeletions?: number
}

interface DataProps {
  data: HeaderProps[]
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
  currentUser?: string
}

const LineTitle: React.FC<LineTitleProps> = ({ text, numAdditions, numDeletions, useTranslationStore }) => {
  const { t } = useTranslationStore()
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2">
        <Text weight="medium">{text}</Text>
        <div
          role="button"
          tabIndex={0}
          onClick={e => {
            e.preventDefault()
          }}
        >
          <CopyButton name={text} className="text-tertiary-background" />
        </div>
        {numAdditions != null && numAdditions > 0 && (
          <Badge variant="outline" size="sm" theme="success">
            +{numAdditions}
          </Badge>
        )}
        {numDeletions != null && numDeletions > 0 && (
          <Badge variant="outline" size="sm" theme="destructive">
            -{numDeletions}
          </Badge>
        )}
      </div>
      <div className="inline-flex items-center gap-x-6">
        <div title="coming soon" className="flex items-center gap-2">
          <Checkbox title="coming soon" checked className="size-4" />
          {/* This would need to be dynamic text value if/when viewing functionality is hooked up */}
          <Text title="coming soon" size={2} className="text-primary/90">
            {t('views:pullRequests.viewed')}
          </Text>
        </div>
        {/* <Button title="coming soon" variant="ghost" size="sm">
        <Icon name="ellipsis" size={12} className="text-primary-muted/40" />
      </Button> */}
      </div>
    </div>
  )
}

const PullRequestAccordion: React.FC<{
  header?: HeaderProps
  data?: string
  diffMode: DiffModeEnum
  useTranslationStore: () => TranslationStore
  currentUser?: string
}> = ({ header, diffMode, useTranslationStore, currentUser }) => {
  const { highlight, wrap, fontsize } = useDiffConfig()

  const startingLine =
    parseStartingLineIfOne(header?.data ?? '') !== null ? parseStartingLineIfOne(header?.data ?? '') : null
  return (
    <StackedList.Root>
      <StackedList.Item disableHover isHeader className="cursor-default p-0 hover:bg-transparent">
        <Accordion type="multiple" className="w-full">
          <AccordionItem isLast value={header?.text ?? ''}>
            <AccordionTrigger leftChevron className="p-4 text-left">
              <StackedList.Field
                title={
                  <LineTitle
                    useTranslationStore={useTranslationStore}
                    text={header?.text ?? ''}
                    numAdditions={header?.numAdditions}
                    numDeletions={header?.numDeletions}
                  />
                }
              />
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
                    fileName={header?.title ?? ''}
                    lang={header?.lang ?? ''}
                    currentUser={currentUser}
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

export function PullRequestChanges({ data, diffMode, useTranslationStore, currentUser }: DataProps) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <PullRequestAccordion
          key={`item?.title ? ${item?.title}-${index} : ${index}`}
          header={item}
          data={item?.data}
          diffMode={diffMode}
          useTranslationStore={useTranslationStore}
          currentUser={currentUser}
        />
      ))}
    </div>
  )
}
