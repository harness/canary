import { Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { SandboxLayout } from '@harnessio/views'

interface PageNotPublicProps {
  currentPath?: string
}

const PageNotPublic = ({ currentPath: _currentPath }: PageNotPublicProps) => {
  const { t } = useTranslation()

  return (
    <SandboxLayout.Main className="peer flex" fullWidth>
      <div className="m-auto flex max-w-[332px] flex-col items-center text-center">
        <span className="mb-cn-lg text-cn-size-12 text-cn-3 font-bold leading-none">403</span>
        <Text as="span" variant="heading-section" color="foreground-1" className="mb-cn-xs">
          {t('views:notPublic.title', 'This page is not public')}
        </Text>
        <Text as="span" color="foreground-3">
          {t('views:notPublic.description', 'The page you are trying to access is not available for public viewing.')}
        </Text>
      </div>
    </SandboxLayout.Main>
  )
}

export default PageNotPublic
