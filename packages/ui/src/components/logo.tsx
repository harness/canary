import { FC } from 'react'

import {
  siAmazonwebservices,
  siAwssecretsmanager,
  siBitbucket,
  siDocker,
  siGithub,
  siGitlab,
  siGooglecloud,
  siJira,
  siKubernetes,
  siTerraform,
  siVault,
  type SimpleIcon
} from 'simple-icons'

export type LogoName =
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'jira'
  | 'kubernetes'
  | 'awskms'
  | 'terraform'
  | 'docker'
  | 'aws'
  | 'gcp'
  | 'hashiCorpVault'
  | 'awsSecretsManager'
  | 'gcpSecretManager'

const LogoNameMap: Record<LogoName, SimpleIcon> = {
  github: siGithub,
  gitlab: siGitlab,
  bitbucket: siBitbucket,
  jira: siJira,
  kubernetes: siKubernetes,
  aws: siAmazonwebservices,
  awskms: siAwssecretsmanager,
  awsSecretsManager: siAwssecretsmanager,
  terraform: siTerraform,
  docker: siDocker,
  hashiCorpVault: siVault,
  gcp: siGooglecloud,
  gcpSecretManager: siGooglecloud
}

interface LogoProps {
  name: keyof typeof LogoNameMap
  size?: number
  original?: boolean // Uses brand color when true
}

const Logo: FC<LogoProps> = ({ name, size = 24, original = true }) => {
  const icon = LogoNameMap[name]

  if (!icon) return <></>

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={icon.path} fill={original ? `#${icon.hex}` : 'currentColor'} />
    </svg>
  )
}

export { Logo, LogoNameMap }
