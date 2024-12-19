import { CodeModes } from '@harnessio/ui/views'

import { RepoFilesWrapper } from './components/repo-files-wrapper'

export const RepoFilesMarkdownView = () => {
  return <RepoFilesWrapper codeMode={CodeModes.VIEW} isDir={false} isMarkdown />
}
