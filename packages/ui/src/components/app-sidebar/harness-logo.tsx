import { useRouterContext } from '@/context'
import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

import { Illustration } from '../illustration'

export const HarnessLogo = ({ className }: { className?: string }) => {
  const { Link } = useRouterContext()

  return (
    <Link to="/" className={cn('flex items-center px-2 w-fit', className)}>
      <IconV2 name="harness-plugins" size="md" className="text-[--cn-comp-sidebar-logo-icon]" />
      <div className="ml-0.5 max-w-20 overflow-hidden opacity-100 transition-[max-width,opacity,margin-left] ease-linear group-data-[state=collapsed]:ml-0 group-data-[state=collapsed]:max-w-0 group-data-[state=collapsed]:opacity-0">
        <Illustration name="harness-logo-text" width={65} height={15} className="text-cn-foreground-1" />
      </div>
    </Link>
  )
}
