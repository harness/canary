import { Avatar, AvatarFallback, AvatarImage, Text } from '@harnessio/canary'

import { getInitials } from '../utils/utils'
import { Layout } from './layout/layout'

interface ContactCardProps {
  authorEmail: string
  authorName?: string
  imgSrc?: string
  fallback?: string | React.ReactNode
}

export const ContactCard: React.FC<ContactCardProps> = ({ imgSrc, fallback, authorEmail, authorName }) => {
  const initials = getInitials(authorEmail || authorName || '')

  return (
    <Layout.Horizontal gap="space-x-3">
      <Avatar>
        <AvatarImage src={imgSrc} />
        <AvatarFallback>{fallback ?? initials}</AvatarFallback>
      </Avatar>
      {initials && (
        <div className="flex flex-col">
          {authorName && <Text className="text-sm text-primary">{authorName}</Text>}
          {authorEmail && <Text className="text-xs leading-3 text-user">{authorEmail}</Text>}
        </div>
      )}
    </Layout.Horizontal>
  )
}
