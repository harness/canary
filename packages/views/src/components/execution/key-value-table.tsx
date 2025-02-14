import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Text } from '@harnessio/canary'
import { Table } from '@harnessio/ui/components'

export type KeyValuePair = {
  name: string
  value: string | KeyValuePair[]
}

interface KeyValueTableProps {
  tableTitleName: string
  tableTitleVal: string
  className?: string
  tableSpec: KeyValuePair[]
}

//manage style for using repeatedly
const accordionContentStyle = `w-full pl-1 pr-0 pb-0`
const specTitleStyle = 'flex-grow text-studio-2 text-left'

export const KeyValueTable: React.FC<KeyValueTableProps> = ({
  className,
  tableTitleName,
  tableTitleVal,
  tableSpec
}) => {
  const renderListItems = (items: KeyValuePair[], level: number = 1) => {
    //detect if the listItems is objects or array, tailwind css will not generate
    const listItems = Array.isArray(items) ? items : [items]

    return listItems.map((item, index: number) => {
      if (typeof item.value === 'string') {
        return (
          <ul className="flex flex-row border-b align-middle" key={index}>
            <li className="w-1/2 py-2.5 pr-2.5 text-studio-7" style={{ paddingLeft: `${level + 1}rem` }}>
              <Text size={2} weight="normal">
                {item.name}
              </Text>
            </li>
            <li className="w-1/2 py-2.5 pl-1.5 pr-2.5 text-studio-7">
              <Text size={2} weight="normal">
                {item.value}
              </Text>
            </li>
          </ul>
        )
      } else if (Array.isArray(item.value) || typeof item.value === 'object') {
        return (
          <Accordion type="single" key={index} className="border-0" defaultValue={item.name} collapsible>
            <AccordionItem value={item.name} className="border-0">
              <AccordionTrigger
                className="flex w-full gap-1 py-2.5 pr-4"
                leftChevron
                style={{
                  paddingLeft: `${level + 1}rem`
                }}
              >
                <Text size={2} weight="normal" className={specTitleStyle}>
                  {item.name}
                </Text>
              </AccordionTrigger>
              <AccordionContent className={accordionContentStyle}>
                {renderListItems(item.value, level + 1)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      }
      return null
    })
  }

  const renderTableRows = (tableSpec: KeyValuePair[]) => {
    return tableSpec.map((item, index: number) => {
      if (typeof item.value === 'string') {
        return (
          <Table.Row key={index} className="border-b">
            <Table.Cell className="w-1/2 py-2.5 pl-5">
              <Text size={2} weight="normal" className="text-studio-7">
                {item.name}
              </Text>
            </Table.Cell>
            <Table.Cell className="w-1/2 py-2.5">
              <Text size={2} weight="normal" className="text-studio-7">
                {item.value}
              </Text>
            </Table.Cell>
          </Table.Row>
        )
      } else if (Array.isArray(item.value) || typeof item.value === 'object') {
        return (
          <Table.Row key={index} className="border-0">
            <Table.Cell colSpan={2} className="border-0 p-0">
              <Accordion type="single" collapsible defaultValue={item.name}>
                <AccordionItem value={item.name} className="border-0">
                  <AccordionTrigger
                    className="flex w-full gap-1 px-4 py-2.5 data-[state=closed]:border-b data-[state=open]:border-b-0"
                    leftChevron
                  >
                    <Text size={2} weight="normal" className={specTitleStyle}>
                      {item.name}
                    </Text>
                  </AccordionTrigger>
                  <AccordionContent className={accordionContentStyle}>{renderListItems(item.value)}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Table.Cell>
          </Table.Row>
        )
      }
      return null
    })
  }

  return (
    <Table.Root className={className}>
      <Table.Header>
        <Table.Row>
          <Table.Head className="py-3">
            <Text size={2} weight="semibold" className="text-primary">
              {tableTitleName}
            </Text>
          </Table.Head>
          <Table.Head className="py-3">
            <Text size={2} weight="semibold" className="text-primary">
              {tableTitleVal}
            </Text>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>{Array.isArray(tableSpec) && renderTableRows(tableSpec)}</Table.Body>
    </Table.Root>
  )
}
