import { noop, useTranslationStore } from '@utils/viewUtils'

import { CreateProjectPage } from '@harnessio/ui/views'

export const CreateProjectView = ({ isAdditional = false }: { isAdditional?: boolean }) => {
  const commonProps = {
    isLoading: false,
    error: '',
    onFormSubmit: noop,
    useTranslationStore: useTranslationStore
  }

  if (isAdditional) {
    return <CreateProjectPage {...commonProps} isAdditional={isAdditional} backLinkProps={{ to: '/' }} />
  }

  return <CreateProjectPage {...commonProps} logoutLinkProps={{ to: '/' }} />
}
