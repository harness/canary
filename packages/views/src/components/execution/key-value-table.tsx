import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@harnessio/canary'

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

//manage style for using repeatly
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
            <li className="text-studio-7 w-1/2 py-2.5 pr-2.5" style={{ paddingLeft: `${level + 1}rem` }}>
              <Text size={2} weight="normal">
                {item.name}
              </Text>
            </li>
            <li className="text-studio-7 w-1/2 py-2.5 pl-1.5 pr-2.5">
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
          <TableRow key={index} className="border-b">
            <TableCell className="w-1/2 py-2.5 pl-5">
              <Text size={2} weight="normal" className="text-studio-7">
                {item.name}
              </Text>
            </TableCell>
            <TableCell className="w-1/2 py-2.5">
              <Text size={2} weight="normal" className="text-studio-7">
                {item.value}
              </Text>
            </TableCell>
          </TableRow>
        )
      } else if (Array.isArray(item.value) || typeof item.value === 'object') {
        return (
          <TableRow key={index} className="border-0">
            <TableCell colSpan={2} className="border-0 p-0">
              <Accordion type="single" collapsible defaultValue={item.name}>
                <AccordionItem value={item.name} className="border-0">
                  <AccordionTrigger
                    className="flex w-full gap-1 py-2.5 pl-4 pr-4 data-[state=closed]:border-b data-[state=open]:border-b-0"
                    leftChevron
                  >
                    <Text size={2} weight="normal" className={specTitleStyle}>
                      {item.name}
                    </Text>
                  </AccordionTrigger>
                  <AccordionContent className={accordionContentStyle}>{renderListItems(item.value)}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </TableCell>
          </TableRow>
        )
      }
      return null
    })
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead className="py-3">
            <Text size={2} weight="semibold" className="text-primary">
              {tableTitleName}
            </Text>
          </TableHead>
          <TableHead className="py-3">
            <Text size={2} weight="semibold" className="text-primary">
              {tableTitleVal}
            </Text>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{Array.isArray(tableSpec) && renderTableRows(tableSpec)}</TableBody>
    </Table>
  )
}
