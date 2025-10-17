import { IconV2, Layout } from '@/components'
import { useRouterContext } from '@/context'

import AvatarDropdown from './avatar-dropdown'
import ScopeSelector from './scope-selector'

export default function Header() {
  const { Link } = useRouterContext()

  return (
    <Layout.Flex className="bg-cn-0 p-cn-header h-cn-header" gap="md" justify="between" align="center">
      <Link to="/">
        <IconV2 name="harness-plugins" size="xl" className="text-cn-brand" />
      </Link>
      <div className="w-full">
        <ScopeSelector />
      </div>
      <AvatarDropdown />
    </Layout.Flex>
  )
}
