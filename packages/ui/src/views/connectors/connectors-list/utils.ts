import { LogoNameMapV2 } from '@components/logo-v2'

import { ConnectorConfigType } from '../types'

export const ConnectorTypeToLogoNameMap: Map<ConnectorConfigType, keyof typeof LogoNameMapV2> = new Map([
  ['Github', 'github'],
  ['Gitlab', 'gitlab'],
  ['Bitbucket', 'bitbucket'],
  ['Jira', 'jira'],
  ['K8sCluster', 'kubernetes'],
  ['DockerRegistry', 'docker'],
  ['Aws', 'aws'],
  ['AwsSecretManager', 'aws'],
  ['Gcp', 'google'],
  ['GcpSecretManager', 'google'],
  ['GcpKms', 'google'],
  ['AwsKms', 'aws'],
  ['TerraformCloud', 'terraform'],
  ['Vault', 'hashicorp'],
  ['HttpHelmRepo', 'helm'],
  ['Rancher', 'rancher'],
  ['Datadog', 'data-dog'],
  ['ServiceNow', 'servicenow'],
  ['SignalFX', 'sfx'],
  ['NewRelic', 'new-relic'],
  ['Git', 'git'],
  ['Splunk', 'splunk']
])
