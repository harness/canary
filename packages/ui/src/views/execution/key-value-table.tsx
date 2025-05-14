import { FC } from 'react'

import { Accordion, Table, Text } from '@/components'

import { KeyValuePair, KeyValueTableProps } from './types'

//manage style for using repeatedly
const accordionContentStyle = `w-full pl-1 pr-0 pb-0`
const specTitleStyle = 'flex-grow text-studio-2 text-left'

export const KeyValueTable: FC<KeyValueTableProps> = ({ className, tableTitleName, tableTitleVal, tableSpec }) => {
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
          <Accordion.Root
            type="single"
            key={index}
            className="border-0"
            defaultValue={item.name}
            collapsible
            indicatorPosition="left"
          >
            <Accordion.Item value={item.name} className="border-0">
              <Accordion.Trigger
                className="pr-4"
                style={{
                  paddingLeft: `${level + 1}rem`
                }}
              >
                <Text size={2} weight="normal" className={specTitleStyle}>
                  {item.name}
                </Text>
              </Accordion.Trigger>
              <Accordion.Content className={accordionContentStyle}>
                {renderListItems(item.value, level + 1)}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
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
              <Accordion.Root type="single" collapsible defaultValue={item.name} indicatorPosition="left">
                <Accordion.Item value={item.name} className="border-0">
                  <Accordion.Trigger className="px-4">
                    <Text size={2} weight="normal" className={specTitleStyle}>
                      {item.name}
                    </Text>
                  </Accordion.Trigger>
                  <Accordion.Content className={accordionContentStyle}>{renderListItems(item.value)}</Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
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
            <Text size={2} weight="semibold" className="text-cn-foreground-1">
              {tableTitleName}
            </Text>
          </Table.Head>
          <Table.Head className="py-3">
            <Text size={2} weight="semibold" className="text-cn-foreground-1">
              {tableTitleVal}
            </Text>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>{Array.isArray(tableSpec) && renderTableRows(tableSpec)}</Table.Body>
    </Table.Root>
  )
}
