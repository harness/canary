import { siBitbucket, siGithub, siGitlab, siJira, siKubernetes, type SimpleIcon } from 'simple-icons'

export const LogoNameMap = {
  github: siGithub,
  gitlab: siGitlab,
  bitbucket: siBitbucket,
  jira: siJira,
  kubernetes: siKubernetes
} satisfies Record<string, SimpleIcon>
