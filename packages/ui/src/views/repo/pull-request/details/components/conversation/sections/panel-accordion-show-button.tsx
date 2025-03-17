import { FC } from 'react'

interface PanelAccordionShowButtonProps {
  isShowButton: boolean
  value: string
  accordionValues: string[]
}

export const PanelAccordionShowButton: FC<PanelAccordionShowButtonProps> = ({
  isShowButton,
  value,
  accordionValues
}) => {
  if (!isShowButton) return <></>

  return (
    <span className="self-start px-2 text-14 text-foreground-2 transition-colors duration-200 group-hover:text-foreground-1">
      Show {accordionValues.includes(value) ? 'less' : 'more'}
    </span>
  )
}
