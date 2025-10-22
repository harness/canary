import { FC } from 'react'

import { Button, IconV2, Text } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'

export interface NotFoundPageProps {
  pageTypeText?: string
  errorMessage?: string
}

export const NotFoundPage: FC<NotFoundPageProps> = ({ pageTypeText, errorMessage }) => {
  const { t } = useTranslation()

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <SandboxLayout.Main className="peer flex" fullWidth>
      <div className="m-auto flex max-w-[332px] flex-col items-center text-center">
        <span className="mb-cn-lg text-12 text-cn-3 font-bold">404</span>
        <Text as="span" variant="heading-section" color="foreground-1" className="mb-cn-xs">
          {t('views:notFound.title', 'Something went wrong…')}
        </Text>
        <Text as="span" color="foreground-3" className="mb-cn-xl">
          {pageTypeText
            ? t(
                'views:notFound.descriptionWithType',
                `The requested page is not found. You can go back to view all ${pageTypeText} and manage your settings.`,
                { type: pageTypeText }
              )
            : errorMessage || t('views:notFound.description', 'The requested page is not found.')}
        </Text>
        <Button variant="outline" type="button" onClick={handleReload}>
          <IconV2 name="refresh" />
          {t('views:notFound.button', 'Reload Page')}
        </Button>
      </div>
    </SandboxLayout.Main>
  )
}
