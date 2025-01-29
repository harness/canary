import { RepoEmptyView } from '@harnessio/ui/views'

export const RepoEmpty = () => {
  return (
    <RepoEmptyView
      httpUrl="https://github.com/mock-repo"
      repoName="mock-repo"
      projName="mock-project"
      sshUrl="git@github.com:mock-repo.git"
    />
  )
}
