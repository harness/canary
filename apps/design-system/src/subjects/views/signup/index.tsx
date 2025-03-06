import { noop, useTranslationStore } from '@utils/viewUtils'

import { SignUpPage } from '@harnessio/ui/views'

export const SignUpView = () => {
  return <SignUpPage isLoading={false} handleSignUp={noop} error={''} useTranslationStore={useTranslationStore} />
}
