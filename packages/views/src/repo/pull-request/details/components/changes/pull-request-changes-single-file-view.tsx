import { useTranslation } from '@/context'
import { TypesUser } from '@/types'
import {
  CommentItem,
  CommitFilterItemProps,
  CommitSuggestion,
  HandleUploadType,
  PrincipalPropsType,
  TypesPullReq,
  TypesPullReqActivity
} from '@/views'
import { Alert } from '@components/alert'
import { DiffModeEnum } from '@git-diff-view/react'
import { HeaderProps, PullRequestAccordion } from '@views/repo/pull-request/components/pull-request-accordian'
import { innerBlockName, outterBlockName } from '@views/repo/pull-request/utils'

import { getFileComments } from './pull-request-changes'

interface PullRequestChangesSingleFileViewProps {
  data: HeaderProps[]
  diffBlocks: HeaderProps[][]
  diffPathQuery?: string
  comments: CommentItem<TypesPullReqActivity>[][]
  diffMode: DiffModeEnum
  currentUser?: TypesUser
  handleSaveComment: (comment: string, parentId?: number) => Promise<void>
  deleteComment: (id: number) => Promise<void>
  updateComment: (id: number, comment: string) => Promise<void>
  defaultCommitFilter: CommitFilterItemProps
  selectedCommits: CommitFilterItemProps[]
  markViewed: (filePath: string, checksumAfter: string) => void
  unmarkViewed: (filePath: string) => void
  onCopyClick?: (commentId?: number) => void
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
  suggestionsBatch: CommitSuggestion[]
  onCommitSuggestion: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch: (commentId: number) => void
  filenameToLanguage: (fileName: string) => string | undefined
  toggleConversationStatus: (status: string, parentId?: number) => void
  handleUpload?: HandleUploadType
  onGetFullDiff: (path?: string) => Promise<string | void>
  toRepoFileDetails?: ({ path }: { path: string }) => string
  pullReqMetadata?: TypesPullReq
  principalProps: PrincipalPropsType
  currentRefForDiff?: string
}

export function PullRequestChangesSingleFileView({
  data,
  diffBlocks,
  diffPathQuery,
  comments,
  diffMode,
  currentUser,
  handleSaveComment,
  deleteComment,
  updateComment,
  defaultCommitFilter,
  selectedCommits,
  markViewed,
  unmarkViewed,
  onCopyClick,
  onCommentSaveAndStatusChange,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch,
  filenameToLanguage,
  toggleConversationStatus,
  handleUpload,
  onGetFullDiff,
  toRepoFileDetails,
  pullReqMetadata,
  principalProps,
  currentRefForDiff
}: PullRequestChangesSingleFileViewProps) {
  const { t } = useTranslation()
  // For large PRs, determine which single file to show
  const getSingleFileToShow = () => {
    if (diffPathQuery) {
      const targetFile = data.find(item => item.filePath === diffPathQuery)
      if (targetFile) return targetFile
    }
    // Default to first file if no diffPathQuery or file not found
    return data[0]
  }

  const singleFile = getSingleFileToShow()
  const blockIndex = diffBlocks.findIndex(block => block.some(item => item.filePath === singleFile.filePath))

  if (!singleFile || blockIndex === -1) {
    return null
  }

  const fileComments = getFileComments(singleFile, comments)

  return (
    <>
      <Alert.Root theme="info" expandable>
        <Alert.Title>{t('views:pullRequests.largePRMode', 'Large Pull Request Mode')}</Alert.Title>
        <Alert.Description>
          {t(
            'views:pullRequests.largePRModeDescription',
            `Due to the large number of changes (${data.length} files) in this pull request, only one file is being shown at a time.`,
            { files: data.length }
          )}
        </Alert.Description>
      </Alert.Root>
      <div key={blockIndex} data-block={outterBlockName(blockIndex)} className="pt-cn-xs">
        <div className="pt-cn-xs" key={singleFile.filePath}>
          <div data-block={innerBlockName(singleFile.filePath)}>
            <PullRequestAccordion
              handleUpload={handleUpload}
              principalProps={principalProps}
              key={singleFile.title}
              header={singleFile}
              diffMode={diffMode}
              currentUser={currentUser}
              comments={fileComments}
              handleSaveComment={handleSaveComment}
              deleteComment={deleteComment}
              updateComment={updateComment}
              defaultCommitFilter={defaultCommitFilter}
              selectedCommits={selectedCommits}
              markViewed={markViewed}
              unmarkViewed={unmarkViewed}
              autoExpand={true} // Always expand in single-file mode
              onCopyClick={onCopyClick}
              onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
              onCommitSuggestion={onCommitSuggestion}
              addSuggestionToBatch={addSuggestionToBatch}
              suggestionsBatch={suggestionsBatch}
              removeSuggestionFromBatch={removeSuggestionFromBatch}
              filenameToLanguage={filenameToLanguage}
              toggleConversationStatus={toggleConversationStatus}
              onGetFullDiff={onGetFullDiff}
              openItems={[singleFile.text]}
              isOpen={true} // Always open in single-file mode
              onToggle={() => {}} // No toggle in single-file mode
              setCollapsed={() => {}} // No collapse in single-file mode
              toRepoFileDetails={toRepoFileDetails}
              sourceBranch={pullReqMetadata?.source_branch}
              currentRefForDiff={currentRefForDiff}
              commentLayout="compact"
            />
          </div>
        </div>
      </div>
    </>
  )
}
