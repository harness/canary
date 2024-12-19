import { CodeModes } from '@harnessio/ui/views'

import { RepoFilesWrapper } from './components/repo-files-wrapper'

export const RepoFilesEditView = () => {
  return <RepoFilesWrapper codeMode={CodeModes.EDIT} isDir={false} />
}
