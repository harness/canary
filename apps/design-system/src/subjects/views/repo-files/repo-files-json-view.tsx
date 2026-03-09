import { CodeModes } from '@harnessio/views'

import { RepoFilesWrapper } from './components/repo-files-wrapper'

export const RepoFilesJsonView = () => {
  return <RepoFilesWrapper codeMode={CodeModes.VIEW} isDir={false} />
}
