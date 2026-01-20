import { noop } from 'lodash-es'

import { SecretListPage } from '@harnessio/ui/views'

import mockSecretManager from './mock-secret-manager.json'
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
    setSecretManagerSearchQuery={noop}
    isLoading={false}
    secretManagerIdentifiers={mockSecretManager.data.content.map(secretManager => ({
      name: secretManager.connector.name,
      identifier: secretManager.connector.identifier
    }))}
    isSecretManagerIdentifierLoading={false}
    setSearchQuery={noop}
    onEditSecret={noop}
    onDeleteSecret={noop}
    currentPage={1}
    totalItems={10}
    pageSize={10}
    goToPage={noop}
    scope={{
      accountId: 'account-id',
      orgIdentifier: 'org-id',
      projectIdentifier: 'project-id'
    }}
    isFiltered={false}
    onCreateSecret={noop}
  />
)

export { SecretsListPage }
