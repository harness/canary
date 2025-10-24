import { useTranslation } from '@/context'
import { NoData, NoDataProps } from '@components/no-data'

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
