import { useRouterContext } from '@/context'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'

export const HarnessLogo = ({ className }: { className?: string }) => {
  const { Link } = useRouterContext()

  return (
    <Link to="/" className={cn('flex items-center', className)}>
      <Icon name="harness" size={18} className="text-sidebar-foreground-accent" />
      <div
        className={cn(
          'overflow-hidden max-w-20 mb-px ml-0.5 opacity-100 transition-[max-width,opacity,margin-left] group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:max-w-0 group-data-[state=collapsed]:ml-0 ease-linear'
        )}
      >
        <Icon name="harness-logo-text" width={65} height={15} className="text-sidebar-foreground-1" />
      </div>
    </Link>
  )
}
