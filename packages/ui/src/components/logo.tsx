import { FC, SVGProps } from 'react'

import {
  siAmazonwebservices,
  siAwssecretsmanager,
  siBitbucket,
  siDocker,
  siGithub,
  siGitlab,
  siGooglecloud,
  siHelm,
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
  | 'helm'

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
  gcpSecretManager: siGooglecloud,
  helm: siHelm
}

export interface LogoProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof LogoNameMap
  size?: number
  original?: boolean // Uses brand color when true
  className?: string
}

const Logo: FC<LogoProps> = ({ name, size = 24, original = true, ...props }) => {
  const icon = LogoNameMap[name]

  if (!icon) return <></>

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{ minWidth: `${size}px`, minHeight: `${size}px`, ...props.style }}
    >
      <path d={icon.path} fill={original ? `#${icon.hex}` : 'currentColor'} />
    </svg>
  )
}

export { Logo, LogoNameMap }
