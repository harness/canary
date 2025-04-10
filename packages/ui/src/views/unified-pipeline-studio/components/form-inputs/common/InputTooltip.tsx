import { Icon } from '@/components'

interface InputTooltipProps {
  tooltip: string
}

function InputTooltip(props: InputTooltipProps): JSX.Element | null {
  const { tooltip } = props
  return (
    <div className="w-full pt-2">
      <div className="flex items-center gap-2 border rounded-md bg-cn-background-2 bg-gradient-to-b from-white/[0.04] to-white/0 p-2">
        <Icon size={14} name="info-circle" className="text-cn-foreground-3" />
        <span className="text-[12px] text-cn-foreground-1">{tooltip}</span>
      </div>
    </div>
  )
}

export { InputTooltip }
