import { CodeModes } from '@harnessio/views'

import { RepoFilesWrapper } from './components/repo-files-wrapper'

export const RepoFilesMarkdownView = () => {
  return <RepoFilesWrapper codeMode={CodeModes.VIEW} isDir={false} isMarkdown />
}
