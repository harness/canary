import { FC, useMemo } from 'react'

import { EnumBypassListType } from '@views/repo'
import { TypesPrincipalInfo, TypesUserGroupInfo } from '@views/repo/pull-request/details/pull-request-details-types'
import { combineAndNormalizePrincipalsAndGroups } from '@views/repo/utils'
import { isEmpty } from 'lodash-es'

import {
  Avatar,
  AvatarTooltipProps,
  AvatarWithTooltip,
  IconV2,
  IconWithTooltip,
  Layout,
  StackedList,
  Text
} from '@harnessio/ui/components'

interface ReviewerPanelProps {
  principals?: TypesPrincipalInfo[]
  userGroups?: TypesUserGroupInfo[]
}

export const ReviewersPanel: FC<ReviewerPanelProps> = ({ principals, userGroups }) => {
  const normalizedPrincipals = useMemo(
    () => combineAndNormalizePrincipalsAndGroups(principals || [], userGroups, true),
    [principals, userGroups]
  )

  if (isEmpty(normalizedPrincipals)) {
    return null
  }

  return (
    <StackedList.Field
      title={
        <div className="flex items-center">
          {normalizedPrincipals.map((principal, idx) => {
            if (idx < 2) {
              const tooltipProps: AvatarTooltipProps = {
                side: 'top',
                content: (
                  <Layout.Horizontal align="center" justify="between" className="m-cn-3xs">
                    {principal?.type === EnumBypassListType.USER_GROUP ? (
                      <IconV2 name={'group-1'} size="lg" />
                    ) : (
                      <Avatar name={principal?.display_name || ''} size="lg" rounded />
                    )}
                    <Layout.Vertical gap="3xs">
                      <Text>{principal?.display_name}</Text>
                      <Text>{principal?.email_or_identifier}</Text>
                    </Layout.Vertical>
                  </Layout.Horizontal>
                )
              }

              if (principal?.type === EnumBypassListType.USER_GROUP) {
                return (
                  <IconWithTooltip
                    {...tooltipProps}
                    key={principal?.id || idx}
                    iconProps={{ name: 'group-1', size: 'lg' }}
                  />
                )
              }
              return (
                <AvatarWithTooltip
                  key={principal?.id || idx}
                  name={principal?.display_name || ''}
                  size="sm"
                  rounded={principal?.type === EnumBypassListType.USER}
                  tooltipProps={tooltipProps}
                />
              )
            }
          })}
          {/* Get all emails from remaining normalizedPrincipals (index 2 and beyond) */}
          {normalizedPrincipals.length > 2 && (
            <AvatarWithTooltip
              name={`+${normalizedPrincipals.length - 2}`}
              size="sm"
              noInitials
              rounded
              tooltipProps={{
                side: 'top',
                content: (
                  <ul className="my-cn-3xs flex flex-col gap-y-cn-4xs">
                    {normalizedPrincipals.slice(2).map(({ email_or_identifier, type }) => (
                      <div
                        key={email_or_identifier}
                        className="flex w-full grow cursor-not-allowed items-center gap-x-cn-xs rounded p-cn-3xs px-0"
                      >
                        {type === EnumBypassListType.USER_GROUP ? (
                          <IconV2 name={'group-1'} size="lg" className="mx-cn-4xs" />
                        ) : (
                          <Avatar name={email_or_identifier} size="sm" rounded className="mr-cn-3xs" />
                        )}
                        <Text>{email_or_identifier}</Text>
                      </div>
                    ))}
                  </ul>
                )
              }}
            />
          )}
        </div>
      }
    />
  )
}
