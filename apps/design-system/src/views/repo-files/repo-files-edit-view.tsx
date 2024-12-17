import { CodeModes } from '@harnessio/ui/views'

import { RepoFilesWrapper } from './components/repo-files-wrapper.tsx'

export const RepoFilesEditView = () => {
  return <RepoFilesWrapper codeMode={CodeModes.EDIT} isDir={false} />
}
