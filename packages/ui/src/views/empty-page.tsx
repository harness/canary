import { NoData } from '@/components'
import { useRouterContext, useTheme } from '@/context'
import { cn } from '@utils/cn'

export const EmptyPage = ({ pathName, comingSoon }: { pathName: string; comingSoon?: boolean }) => {
  const { navigate } = useRouterContext()
  const { isInset } = useTheme()
  return (
    <div className={cn('flex min-h-screen items-center', { 'min-h-full': isInset })}>
      <NoData
        iconName={comingSoon ? 'no-data-cog' : 'no-search-magnifying-glass'}
        title={comingSoon ? 'Coming soon' : `Upgrade to Harness Enterprise to access ${pathName}`}
        description={[]}
        primaryButton={{
          label: 'Take me back',
          onClick: () => navigate(-1)
        }}
      />
    </div>
  )
}
