import { FC } from 'react'

import { Accordion, Icon, LabelMarker } from '@/components'
import { ILabelType, LabelValueType } from '@/views'
import { cn } from '@utils/cn'

export interface LabelCellContentProps {
  label: ILabelType
  values?: LabelValueType[]
}

export const LabelCellContent: FC<LabelCellContentProps> = ({ label, values }) => {
  const isWithValues = values?.length && values.length > 0

  return (
    <Accordion.Root collapsible type="single">
      <Accordion.Item value={label.key} isLast disabled={!isWithValues}>
        <Accordion.Trigger className="max-w-full flex-auto cursor-pointer p-0" hideChevron>
          <div className={cn('flex gap-x-2.5 items-center max-w-full', { 'pl-[22px]': !isWithValues })}>
            {isWithValues && (
              <Icon
                className="flex-none text-icons-1 transition-all group-hover:text-icons-2 group-data-[state=open]:rotate-180 group-data-[state=open]:text-icons-2"
                name="arrow-short"
                size={12}
              />
            )}

            <LabelMarker
              label={label.key}
              color={label.color}
              type={label.type}
              counter={isWithValues ? values.length : undefined}
            />
          </div>
        </Accordion.Trigger>

        {isWithValues && (
          <Accordion.Content className="flex flex-col gap-y-2.5 pb-0 pl-[22px] pt-2.5">
            {values.map(item => (
              <LabelMarker key={item.id} label={label.key} color={item?.color || label.color} value={item.value} />
            ))}
          </Accordion.Content>
        )}
      </Accordion.Item>
    </Accordion.Root>
  )
}
