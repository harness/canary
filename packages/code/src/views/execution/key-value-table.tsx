import { FC } from 'react'

import { Accordion, Table, Text } from '@/components'

import { KeyValuePair, KeyValueTableProps } from './types'

//manage style for using repeatedly
const accordionContentStyle = `w-full pl-cn-3xs pr-0 pb-0`
const specTitleStyle = 'flex-grow text-left'

export const KeyValueTable: FC<KeyValueTableProps> = ({ className, tableTitleName, tableTitleVal, tableSpec }) => {
  const renderListItems = (items: KeyValuePair[], level: number = 1) => {
    //detect if the listItems is objects or array, tailwind css will not generate
    const listItems = Array.isArray(items) ? items : [items]

    return listItems.map((item, index: number) => {
      if (typeof item.value === 'string') {
        return (
          <ul className="flex flex-row border-b align-middle" key={index}>
            <li className="w-1/2 py-cn-xs pr-cn-xs" style={{ paddingLeft: `${level + 1}rem` }}>
              <Text>{item.name}</Text>
            </li>
            <li className="w-1/2 py-cn-xs pl-cn-2xs pr-cn-xs">
              <Text>{item.value}</Text>
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
                className="pr-cn-md"
                style={{
                  paddingLeft: `${level + 1}rem`
                }}
              >
                <Text className={specTitleStyle}>{item.name}</Text>
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
            <Table.Cell className="w-1/2 py-cn-xs pl-cn-lg">
              <Text>{item.name}</Text>
            </Table.Cell>
            <Table.Cell className="w-1/2 py-cn-xs">
              <Text>{item.value}</Text>
            </Table.Cell>
          </Table.Row>
        )
      } else if (Array.isArray(item.value) || typeof item.value === 'object') {
        return (
          <Table.Row key={index} className="border-0">
            <Table.Cell colSpan={2} className="border-0 p-0">
              <Accordion.Root type="single" collapsible defaultValue={item.name} indicatorPosition="left">
                <Accordion.Item value={item.name} className="border-0">
                  <Accordion.Trigger className="px-cn-md">
                    <Text className={specTitleStyle}>{item.name}</Text>
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
          <Table.Head className="py-cn-sm">
            <Text variant="heading-small">{tableTitleName}</Text>
          </Table.Head>
          <Table.Head className="py-cn-sm">
            <Text variant="heading-small">{tableTitleVal}</Text>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>{Array.isArray(tableSpec) && renderTableRows(tableSpec)}</Table.Body>
    </Table.Root>
  )
}
