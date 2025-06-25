import { useRouterContext } from '@/context'
import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

import { Illustration } from './illustration'

export const HarnessLogo = ({ className }: { className?: string }) => {
  const { Link } = useRouterContext()

  return (
    <Link to="/" className={cn('flex items-center', className)}>
      <IconV2 name="harness-plugins" size="md" className="text-cn-foreground-1" />
      <div
        className={cn(
          'overflow-hidden max-w-20 mb-px ml-0.5 opacity-100 transition-[max-width,opacity,margin-left] group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:max-w-0 group-data-[state=collapsed]:ml-0 ease-linear'
        )}
      >
        <Illustration name="harness-logo-text" width={65} height={15} className="text-cn-foreground-1" />
      </div>
    </Link>
  )
}
