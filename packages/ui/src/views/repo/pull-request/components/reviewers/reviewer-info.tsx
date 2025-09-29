import { Layout } from '@components/layout'
import { Text } from '@components/text'

type ReviewerInfoProps = {
  display_name: string
  email: string
}

export const ReviewerInfo: React.FC<ReviewerInfoProps> = ({ display_name, email }) => {
  if (!display_name && !email) return null

  return (
    <Layout.Grid gap="none">
      <Text title={display_name} truncate>
        {display_name}
      </Text>
      {display_name !== email && (
        <Text variant="caption-normal" color="foreground-3" title={email} truncate>
          {email}
        </Text>
      )}
    </Layout.Grid>
  )
}
