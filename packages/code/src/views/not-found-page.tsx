import { FC } from 'react'

import { SandboxLayout } from '@/views'

import { Button, IconV2, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

export interface NotFoundPageProps {
  pageTypeText?: string
  titleText?: string
  errorMessage?: string
  withReloadButton?: boolean
}

export const NotFoundPage: FC<NotFoundPageProps> = ({
  pageTypeText,
  titleText,
  errorMessage,
  withReloadButton = false
}) => {
  const { t } = useTranslation()

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <SandboxLayout.Main className="peer flex" fullWidth>
      <div className="m-auto flex max-w-[332px] flex-col items-center text-center">
        <span className="mb-cn-lg text-cn-size-12 text-cn-3 font-bold leading-none">404</span>
        <Text as="span" variant="heading-section" color="foreground-1" className="mb-cn-xs">
          {titleText ? titleText : t('views:notFound.title', 'Something went wrong…')}
        </Text>
        <Text as="span" color="foreground-3">
          {pageTypeText
            ? t(
                'views:notFound.descriptionWithType',
                `The requested page is not found. You can go back to view all ${pageTypeText} and manage your settings.`,
                { type: pageTypeText }
              )
            : errorMessage || t('views:notFound.description', 'The requested page is not found.')}
        </Text>
        {withReloadButton && (
          <Button className="mt-cn-xl" variant="outline" type="button" onClick={handleReload}>
            <IconV2 name="refresh" />
            {t('views:notFound.button', 'Reload Page')}
          </Button>
        )}
      </div>
    </SandboxLayout.Main>
  )
}
