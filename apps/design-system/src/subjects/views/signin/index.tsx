import { noop } from '@utils/viewUtils'

import { SignInPage } from '@harnessio/views'

export const SignInView = () => {
  return <SignInPage isLoading={false} handleSignIn={noop} error={''} />
}
