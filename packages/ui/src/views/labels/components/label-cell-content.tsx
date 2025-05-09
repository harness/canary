import { FC } from 'react'

import { Accordion, Icon, Tag } from '@/components'
import { ILabelType, LabelValueType } from '@/views'
import { cn } from '@utils/cn'

export interface LabelCellContentProps {
  label: ILabelType
  values?: LabelValueType[]
}

export const LabelCellContent: FC<LabelCellContentProps> = ({ label, values }) => {
  const isWithValues = !!values?.length

  return (
    <Accordion.Root collapsible type="single" withLeftIndicator className="min-w-0">
      <Accordion.Item value={label.key} disabled={!isWithValues} className="border-none">
        <Accordion.Trigger
          className={cn('max-w-full flex-auto cursor-pointer p-0', {
            '[&>.cn-accordion-trigger-indicator]:hidden': !isWithValues
          })}
        >
          <Tag
            variant="secondary"
            size="sm"
            theme={label.color}
            label={label.key}
            value={(values?.length || '').toString()}
          />
        </Accordion.Trigger>

        {isWithValues && (
          <Accordion.Content className="flex flex-col gap-y-2.5 pb-0 pl-5 pt-2.5">
            {values.map(item => (
              <Tag
                key={item.id}
                variant="secondary"
                size="sm"
                theme={item?.color || label.color}
                label={label.key}
                value={item.value}
              />
            ))}
          </Accordion.Content>
        )}
      </Accordion.Item>
    </Accordion.Root>
  )
}
