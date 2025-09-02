import { FC } from 'react'

import { Avatar, Layout, StackedList, Text } from '@/components'
import { AvatarTooltipProps, AvatarWithTooltip } from '@components/avatar'

export interface AvatarUser {
  id?: number
  display_name?: string
  email?: string
}

interface AvatarItemProps {
  users?: AvatarUser[]
}

export const AvatarItem: FC<AvatarItemProps> = ({ users }) => {
  return (
    <StackedList.Field
      title={
        <div className="flex items-center">
          {users &&
            users.map((user, idx) => {
              if (idx < 2) {
                const tooltipProps: AvatarTooltipProps = {
                  side: 'top',
                  content: (
                    <Layout.Horizontal align="center" justify="between" className="m-1">
                      <Avatar name={user?.display_name || ''} size="lg" rounded />
                      <Layout.Vertical gap="2xs">
                        <Text>{user?.display_name}</Text>
                        <Text>{user?.email}</Text>
                      </Layout.Vertical>
                    </Layout.Horizontal>
                  )
                }
                return (
                  <AvatarWithTooltip
                    key={user?.id || idx}
                    name={user?.display_name || ''}
                    size="sm"
                    rounded
                    tooltipProps={tooltipProps}
                  />
                )
              }
              if (idx === 2 && users?.length > 2) {
                // Get all emails from remaining users (index 2 and beyond)
                const remainingEmails = users
                  .slice(2)
                  .map(user => user?.email || user?.display_name || '')
                  .filter(Boolean)

                const tooltipProps: AvatarTooltipProps = {
                  side: 'top',
                  content: (
                    <ul className="my-1 flex flex-col gap-y-0.5">
                      {remainingEmails?.map(email => (
                        <div
                          key={email}
                          className="flex w-full grow cursor-not-allowed items-center gap-x-2.5 rounded p-1 px-0"
                        >
                          <Avatar name={email} size="sm" rounded className="mr-1" />
                          <Text>{email}</Text>
                        </div>
                      ))}
                    </ul>
                  )
                }

                return (
                  <AvatarWithTooltip
                    key={idx}
                    name={`+ ${users.length - 2}`}
                    size="sm"
                    rounded
                    tooltipProps={tooltipProps}
                  />
                )
              }
              return null
            })}
        </div>
      }
    />
  )
}
