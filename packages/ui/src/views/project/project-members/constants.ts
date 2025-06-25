import { TFunctionWithFallback } from '@/context'
import { EnumMembershipRole } from '@/views'

export const getRolesData = (t: TFunctionWithFallback) => {
  return [
    {
      uid: EnumMembershipRole.SPACE_OWNER,
      label: t('views:roles.owner', 'Owner'),
      description: t('views:roles.ownerDesc', 'Admin-level access to all resources.')
    },
    {
      uid: EnumMembershipRole.CONTRIBUTOR,
      label: t('views:roles.contributor', 'Contributor'),
      description: t('views:roles.contributorDesc', 'Can view, comment, and edit resources.')
    },
    {
      uid: EnumMembershipRole.EXECUTOR,
      label: t('views:roles.executor', 'Executor'),
      description: t('views:roles.executorDesc', 'Can view and leave comments.')
    },
    {
      uid: EnumMembershipRole.READER,
      label: t('views:roles.reader', 'Reader'),
      description: t('views:roles.readerDesc', 'Can view but cannot make changes or leave comments.')
    }
  ]
}
