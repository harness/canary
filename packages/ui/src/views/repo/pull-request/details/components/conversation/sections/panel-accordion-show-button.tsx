import { FC } from 'react'

import { Text } from '@components/text'

interface PanelAccordionShowButtonProps {
  isShowButton?: boolean
  value: string
  accordionValues: string[]
}

export const PanelAccordionShowButton: FC<PanelAccordionShowButtonProps> = ({
  isShowButton = false,
  value,
  accordionValues
}) => {
  if (!isShowButton) return <></>

  return (
    <Text color="foreground-2" className="group-hover:text-cn-foreground-1 transition-colors duration-200">
      Show {accordionValues.includes(value) ? 'less' : 'more'}
    </Text>
  )
}
