import { ProjectMemberListView } from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useMemberListStore } from './stores/member-list-store'

export function ProjectMemberListPage() {
  return <ProjectMemberListView useTranslationStore={useTranslationStore} useMemberListStore={useMemberListStore} />
}
