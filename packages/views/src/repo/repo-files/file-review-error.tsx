import { useTranslation } from '@harnessio/ui/context'
import { NoData, NoDataProps } from '@harnessio/ui/components'

export const FileReviewError = ({
  onButtonClick,
  ...props
}: { onButtonClick: () => void } & Omit<NoDataProps, 'title' | 'description'>) => {
  const { t } = useTranslation()

  return (
    <NoData
      withBorder
      {...props}
      title="Error generating preview"
      description={['Please try again or check your connection']}
      imageName="no-data-error"
      secondaryButton={{
        icon: 'refresh',
        label: t('views:repos.fileContent.noData.tryAgain', 'Try again'),
        onClick: onButtonClick
      }}
    />
  )
}
