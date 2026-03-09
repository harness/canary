import { noop } from '@utils/viewUtils'

import { SignUpPage } from '@harnessio/views'

export const SignUpView = () => {
  return <SignUpPage isLoading={false} handleSignUp={noop} error={''} />
}
