import React from 'react'
import { Avatar, AvatarFallback, AvatarImage, Text } from '@harnessio/canary'
import { Layout } from './layout/layout'
import { getInitials } from '../utils/utils'

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
          {authorName && <Text className="text-primary text-sm">{authorName}</Text>}
          {authorEmail && <Text className="text-user leading-3 text-xs">{authorEmail}</Text>}
        </div>
      )}
    </Layout.Horizontal>
  )
}
