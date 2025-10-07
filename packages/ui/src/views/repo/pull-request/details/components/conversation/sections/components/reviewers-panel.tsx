import { FC, useMemo } from 'react'

import { Avatar, IconV2, IconWithTooltip, Layout, StackedList, Text } from '@/components'
import { AvatarTooltipProps, AvatarWithTooltip } from '@components/avatar'
import { EnumBypassListType } from '@views/repo'
import { TypesPrincipalInfo, TypesUserGroupInfo } from '@views/repo/pull-request/details/pull-request-details-types'
import { combineAndNormalizePrincipalsAndGroups } from '@views/repo/repo-branch-rules/utils'
import { isEmpty } from 'lodash-es'

interface ReviewerPanelProps {
  principals?: TypesPrincipalInfo[]
  userGroups?: TypesUserGroupInfo[]
}

export const ReviewersPanel: FC<ReviewerPanelProps> = ({ principals, userGroups }) => {
  const normalizedPrincipals = useMemo(
    () => combineAndNormalizePrincipalsAndGroups(principals || [], userGroups, true),
    [principals, userGroups]
  )

  console.log(normalizedPrincipals)

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
                  <Layout.Horizontal align="center" justify="between" className="m-1">
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
              name={`+ ${normalizedPrincipals.length - 2}`}
              size="sm"
              rounded
              tooltipProps={{
                side: 'top',
                content: (
                  <ul className="my-1 flex flex-col gap-y-0.5">
                    {normalizedPrincipals.slice(2).map(({ email_or_identifier, type }) => (
                      <div
                        key={email_or_identifier}
                        className="flex w-full grow cursor-not-allowed items-center gap-x-2.5 rounded p-1 px-0"
                      >
                        {type === EnumBypassListType.USER_GROUP ? (
                          <IconV2 name={'group-1'} size="lg" className="mx-0.5" />
                        ) : (
                          <Avatar name={email_or_identifier} size="sm" rounded className="mr-1" />
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
