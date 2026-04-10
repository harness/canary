import { Button, DropdownMenu, IconV2, Label, Layout, LogoV2, LogoV2NamesType } from '@harnessio/ui/components'

export enum StoreType {
  Github = 'Github',
  Git = 'Git',
  GitLab = 'Gitlab',
  Bitbucket = 'Bitbucket',
  AzureRepo = 'AzureRepo'
}

interface StoreTypeInfo {
  type: StoreType
  name: string
  logo: LogoV2NamesType
}

const storeTypeConfig: Record<StoreType, StoreTypeInfo> = {
  [StoreType.Github]: {
    type: StoreType.Github,
    name: 'GitHub',
    logo: 'github'
  },
  [StoreType.Git]: {
    type: StoreType.Git,
    name: 'Git',
    logo: 'git'
  },
  [StoreType.GitLab]: {
    type: StoreType.GitLab,
    name: 'GitLab',
    logo: 'gitlab'
  },
  [StoreType.Bitbucket]: {
    type: StoreType.Bitbucket,
    name: 'Bitbucket',
    logo: 'bitbucket'
  },
  [StoreType.AzureRepo]: {
    type: StoreType.AzureRepo,
    name: 'Azure Repos',
    logo: 'azure'
  }
}

const storeTypeOptions = Object.values(storeTypeConfig)

export interface StoreTypeSelectProps {
  value: StoreType
  onChange: (value: StoreType) => void
  label?: string
  placeholder?: string
  disabled?: boolean
}

export function StoreTypeSelect({
  value,
  onChange,
  label = 'Select store type',
  placeholder = 'Select store type',
  disabled
}: StoreTypeSelectProps): JSX.Element {
  const selectedConfig = storeTypeConfig[value]

  return (
    <Layout.Vertical gap="xs">
      {label && <Label>{label}:</Label>}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild disabled={disabled}>
          <Button variant="outline" className="justify-between">
            {selectedConfig ? (
              <Layout.Horizontal gap="xs" align="center">
                <LogoV2 name={selectedConfig.logo} size="sm" />
                {selectedConfig.name}
              </Layout.Horizontal>
            ) : (
              <span className="text-cn-foreground-3">{placeholder}</span>
            )}
            <IconV2 name="nav-arrow-down" size="sm" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {storeTypeOptions.map(option => (
            <DropdownMenu.LogoItem
              key={option.type}
              logo={option.logo}
              title={option.name}
              onClick={() => onChange(option.type)}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Layout.Vertical>
  )
}
