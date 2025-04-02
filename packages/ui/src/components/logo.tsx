import { FC } from 'react'

import { siBitbucket, siGithub, siGitlab, siJira, siKubernetes, type SimpleIcon } from 'simple-icons'

export type LogoName = 'github' | 'gitlab' | 'bitbucket' | 'jira' | 'kubernetes'

const LogoNameMap: Record<LogoName, SimpleIcon> = {
  github: siGithub,
  gitlab: siGitlab,
  bitbucket: siBitbucket,
  jira: siJira,
  kubernetes: siKubernetes
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
