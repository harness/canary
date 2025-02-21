import { noop, useTranslationStore } from '@utils/viewUtils'

import { CreateProjectPage } from '@harnessio/ui/views'

export const CreateProjectView = ({ isAdditional = false }: { isAdditional?: boolean }) => {
  const commonProps = {
    isLoading: false,
    error: '',
    onFormSubmit: noop,
    useTranslationStore: useTranslationStore
  }

  return (
    <>
      {isAdditional && <CreateProjectPage {...commonProps} isAdditional={isAdditional} backLinkProps={{ to: '/' }} />}

      {!isAdditional && <CreateProjectPage {...commonProps} logoutLinkProps={{ to: '/' }} />}
    </>
  )
}
