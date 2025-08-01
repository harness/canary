import { TypesPrincipalInfo, TypesUserGroupInfo } from '../pull-request'
import { EnumBypassListType, NormalizedPrincipal } from './types'

export function combineAndNormalizePrincipalsAndGroups(
  principals: TypesPrincipalInfo[] | null,
  userGroups?: TypesUserGroupInfo[] | null
): NormalizedPrincipal[] {
  const normalizedData: NormalizedPrincipal[] = []

  // Process user groups data if available
  if (userGroups && Array.isArray(userGroups)) {
    userGroups.forEach(group => {
      normalizedData.push({
        id: group.id || -1,
        email_or_identifier: group.identifier || '',
        type: EnumBypassListType.USER_GROUP,
        display_name: group.name || group.identifier || 'Unknown Group'
      })
    })
  }

  // Process principals data if available
  if (principals && Array.isArray(principals)) {
    principals.forEach(principal => {
      normalizedData.push({
        id: principal.id || -1,
        email_or_identifier: principal.email || principal.uid || '',
        type: (principal.type as EnumBypassListType) || EnumBypassListType.USER,
        display_name: principal.display_name || principal.email || 'Unknown User'
      })
    })
  }

  return normalizedData.sort((a, b) => a.display_name.localeCompare(b.display_name))
}

export const getIcon = (type: EnumBypassListType) => {
  switch (type) {
    case EnumBypassListType.USER:
      return 'user'
    case EnumBypassListType.SERVICEACCOUNT:
      return 'service-accounts'
    case EnumBypassListType.USER_GROUP:
      return 'group-1'
    default:
      return 'user'
  }
}
