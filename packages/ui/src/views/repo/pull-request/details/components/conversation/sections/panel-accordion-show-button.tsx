import { FC } from 'react'

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
    <span className="text-14 text-foreground-2 group-hover:text-foreground-1 self-start transition-colors duration-200">
      Show {accordionValues.includes(value) ? 'less' : 'more'}
    </span>
  )
}
