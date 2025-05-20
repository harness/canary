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
    isLoading={false}
    setSearchQuery={noop}
    onEditSecret={noop}
    onDeleteSecret={noop}
    currentPage={1}
    totalItems={10}
    pageSize={10}
    goToPage={noop}
    onCreate={noop}
  />
)

export { SecretsListPage }
