import { CodeModes } from '@harnessio/views'

import { RepoFilesWrapper } from './components/repo-files-wrapper'

export const RepoFilesList = () => {
  return <RepoFilesWrapper codeMode={CodeModes.VIEW} isDir />
}
