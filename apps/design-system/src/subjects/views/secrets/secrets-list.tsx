import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { SecretListPage } from '@harnessio/ui/views'

import mockSecretsList from './mock-secrets-data.json'

const SecretsListPage = (): JSX.Element => (
  <SecretListPage
    secrets={mockSecretsList.map(secret => ({
      name: secret.secret.identifier,
      identifier: secret.secret.identifier,
      spec: {
        secretManagerIdentifier: secret.secret.spec.secretManagerIdentifier
      },
      updatedAt: secret.updatedAt,
      createdAt: secret.createdAt
    }))}
    useTranslationStore={useTranslationStore}
    isLoading={false}
    setSearchQuery={noop}
    onEditSecret={noop}
    onDeleteSecret={noop}
    currentPage={1}
    totalPages={5}
    goToPage={noop}
    onCreate={noop}
  />
)

export { SecretsListPage }
