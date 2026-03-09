import { IconV2 } from '@harnessio/ui/components'

interface InputTooltipProps {
  tooltip: string
}

// TODO: not in use, delete after tooltip implementation is done
function InputTooltip(props: InputTooltipProps): JSX.Element | null {
  const { tooltip } = props
  return (
    <div className="w-full pt-cn-xs">
      <div className="flex gap-cn-xs rounded-cn-3 border bg-cn-2 bg-gradient-to-b from-white/[0.04] to-white/0 p-cn-xs">
        <div className="pt-cn-3xs">
          <IconV2 size="xs" name="info-circle" className="text-cn-3" />
        </div>
        <span className="text-[12px] text-cn-1">{tooltip}</span>
      </div>
    </div>
  )
}

export { InputTooltip }
