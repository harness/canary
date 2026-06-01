import { Button, DropdownMenu, IconV2, Label, Layout, LogoV2, LogoV2NamesType } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

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

export const storeTypeConfig: Record<StoreType, StoreTypeInfo> = {
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

const allStoreTypeOptions = Object.values(storeTypeConfig)

export interface StoreTypeSelectProps {
  value: StoreType
  onChange: (value: StoreType) => void
  label?: string
  disabled?: boolean
  /** Restrict the dropdown to only these store types. Shows all if omitted. */
  allowedTypes?: StoreType[]
}

export function StoreTypeSelect({ value, onChange, label, disabled, allowedTypes }: StoreTypeSelectProps): JSX.Element {
  const { t } = useTranslation()
  const selectedConfig = storeTypeConfig[value]
  const placeholder = t('views:repos.link.selectConnector.placeholder', 'Select connector')
  const options = allowedTypes ? allStoreTypeOptions.filter(o => allowedTypes.includes(o.type)) : allStoreTypeOptions

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
              <span className="text-cn-3">{placeholder}</span>
            )}
            <IconV2 name="nav-arrow-down" size="sm" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {options.map(option => (
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
