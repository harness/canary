import { Layout } from '@components/layout'
import { Text } from '@components/text'

type ReviewerInfoProps = {
  display_name: string
  email: string
}

export const ReviewerInfo: React.FC<ReviewerInfoProps> = ({ display_name, email }) => {
  if (!display_name && !email) return null

  return (
    <Layout.Flex direction="column">
      <Text className="truncate text-2 font-medium text-cn-1" title={display_name}>
        {display_name}
      </Text>
      {display_name !== email && (
        <Text className="truncate line-clamp-1 w-60 text-2 font-medium text-cn-3" title={email}>
          {email}
        </Text>
      )}
    </Layout.Flex>
  )
}
