import { Icon } from '@/components'

interface InputTooltipProps {
  tooltip: string
}

// TODO: not in use, delete after tooltip implementation is done
function InputTooltip(props: InputTooltipProps): JSX.Element | null {
  const { tooltip } = props
  return (
    <div className="w-full pt-2">
      <div className="flex gap-2 rounded-md border bg-cn-background-2 bg-gradient-to-b from-white/[0.04] to-white/0 p-2">
        <div className="pt-1">
          <Icon size={14} name="info-circle" className="text-cn-foreground-3" />
        </div>
        <span className="text-[12px] text-cn-foreground-1">{tooltip}</span>
      </div>
    </div>
  )
}

export { InputTooltip }
