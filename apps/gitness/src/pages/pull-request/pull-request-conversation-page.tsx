import { useCallback, useEffect, useState } from 'react'
import { Spacer } from '@harnessio/canary'
import {
  commentCreatePullReq,
  EnumCheckStatus,
  EnumMergeMethod,
  mergePullReqOp,
  OpenapiMergePullReq,
  TypesPullReqActivity,
  TypesPullReqReviewer,
  useCodeownersPullReqQuery,
  useListPullReqActivitiesQuery,
  useReviewerListPullReqQuery
} from '@harnessio/code-service-client'
import {
  FullWidth2ColumnLayout,
  PullRequestCommentBox,
  PullRequestFilters,
  PullRequestOverview,
  PullRequestPanel,
  PullRequestSideBar,
  SkeletonList
} from '@harnessio/playground'
import { useDateFilters } from './hooks/useDataFilters'
import { useActivityFilters } from './hooks/useActivityFilters'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import {
  capitalizeFirstLetter,
  checkIfOutdatedSha,
  extractInfoForCodeOwnerContent,
  findChangeReqDecisions,
  findWaitingDecisions,
  processReviewDecision
} from './utils'
import { useParams } from 'react-router-dom'
import { PathParams } from '../../RouteDefinitions'
import { usePullRequestData } from './context/pull-request-data-provider'
import { isEmpty } from 'lodash-es'
import { CodeOwnerReqDecision } from '../../types'
export const diffdata = {
  oldFile: {
    fileName: null,
    content: ''
  },
  newFile: {
    fileName: 'src/components/MultiLevelReview/AddReviewConfigModal.tsx'
    // content:
    //   "import type { DepoCatalogueReviewers, UpdateCatalogueReviewersParams } from '@/apis/modules/catalogue/module';\nimport { DepoCatalogueReviewEnum } from '@/apis/modules/catalogue/module';\nimport { gsModalSize } from '@/utils/commonVariable';\nimport { Button, Form, Modal, Radio, message } from 'antd';\nimport { useEffect, useMemo, useState } from 'react';\nimport { UserSelect } from '../UserSelect';\nimport { useCatalogueTree } from '@/hooks/useCatalogueTree';\nimport type { IUserInfo } from '@/apis/modules/user/module';\nimport { updateCatalogueReviewers } from '@/apis/modules/catalogue';\n\nexport const AddReviewConfig = ({ currentReviewList }: { currentReviewList: DepoCatalogueReviewers }) => {\n  const [isOpen, setIsOpen] = useState(false);\n\n  const [loading, setLoading] = useState(false);\n\n  const [userList, setUserList] = useState<IUserInfo[]>([]);\n\n  const { computedSelectItem, reloadCatalogueItemReviewers } = useCatalogueTree.useShallowSelector((s) => ({\n    computedSelectItem: s.computedSelectItem,\n    reloadCatalogueItemReviewers: s.getCatalogueItemReviewers,\n  }));\n\n  const [form] = Form.useForm<{ reviewers: number[]; type: DepoCatalogueReviewEnum }>();\n\n  const selectedList = useMemo(() => currentReviewList.map(i => i.reviewers || []).reduce((p, c) => p.concat(c), []), [currentReviewList])\n\n  useEffect(() => {\n    return () => form.resetFields();\n  }, [form, isOpen]);\n\n  const onSubmit = async () => {\n    if (loading) return;\n    try {\n      setLoading(true);\n      const formValue = await form.validateFields();\n      if (!computedSelectItem) {\n        message.error('意料之外的错误，请刷新重试');\n        return;\n      }\n      const params: UpdateCatalogueReviewersParams = {\n        dirId: computedSelectItem.id,\n        updateCatalogueReviewLevels: [\n          {\n            level: currentReviewList.length + 1,\n            type: formValue.type,\n            reviewers: userList\n              .filter((i) => formValue.reviewers.includes(i.id))\n              .map((i) => ({ id: i.id, username: i.username, nickname: i.nickname })),\n          },\n        ],\n      };\n      const response = await updateCatalogueReviewers(params);\n      if (response.success) {\n        await reloadCatalogueItemReviewers();\n        setIsOpen(false);\n      }\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  return (\n    <>\n      <Button onClick={() => setIsOpen(true)}>新增审查层级</Button>\n      <Modal\n        title=\"新增审查层级\"\n        visible={isOpen}\n        okText=\"提交更改\"\n        width={gsModalSize}\n        onOk={onSubmit}\n        confirmLoading={loading}\n        onCancel={() => setIsOpen(false)}\n      >\n        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} initialValues={{ type: DepoCatalogueReviewEnum.OR }}>\n          <Form.Item label=\"直接审查人\" name=\"reviewers\" rules={[{ required: true, message: '请选择审查人' }]}>\n            <UserSelect\n              mode=\"multiple\"\n              onLoad={(list) => setUserList(list)}\n              disableItems={selectedList}\n              filterOption={(input, option) => !!option?.label?.toString().toLowerCase().includes(input?.toLowerCase())}\n            />\n          </Form.Item>\n          <Form.Item label=\"审查条件\" name=\"type\" rules={[{ required: true, message: '请选择审查条件' }]}>\n            <Radio.Group size=\"middle\" style={{ width: '100%' }}>\n              <Radio.Button value={DepoCatalogueReviewEnum.AND}>会签</Radio.Button>\n              <Radio.Button value={DepoCatalogueReviewEnum.OR}>或签</Radio.Button>\n            </Radio.Group>\n          </Form.Item>\n        </Form>\n      </Modal>\n    </>\n  );\n};",
  },
  hunks: [
    'diff --git a/packages/myreact-reactivity/src/reactive/feature.ts b/packages/myreact-reactivity/src/reactive/feature.ts\nindex 5b301628..15aac42f 100644\n--- a/packages/myreact-reactivity/src/reactive/feature.ts\n+++ b/packages/myreact-reactivity/src/reactive/feature.ts\n@@ -74,7 +74,7 @@ export function createReactive<P extends Record<string, unknown>, S extends Reco\n \n     componentWillUnmount(): void {\n       this.props.$$__instance__$$.onUnmounted.forEach((f) => f());\n-      this.effect.stop();\n+      this.reactiveEffect.stop();\n     '
  ]
}

export default function PullRequestConversationPage() {
  const {
    refetchActivities,
    refetchPullReq,
    pullReqMetadata,
    pullReqChecksDecision,
    prPanelData,
    setRuleViolationArr,
    loading: prLoading
  } = usePullRequestData()
  const repoRef = useGetRepoRef()
  const { pullRequestId } = useParams<PathParams>()
  const prId = (pullRequestId && Number(pullRequestId)) || -1
  // const [loadState, setLoadState] = useState('data-loaded')
  const dateFilters = useDateFilters()
  const [dateOrderSort, setDateOrderSort] = useState<{ label: string; value: string }>(dateFilters[0])
  const activityFilters = useActivityFilters()
  const [activityFilter, setActivityFilter] = useState<{ label: string; value: string }>(activityFilters[0])
  const { data: reviewers, refetch: refetchReviewers } = useReviewerListPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })
  const { data: codeOwners, refetch: refetchCodeOwners } = useCodeownersPullReqQuery({
    repo_ref: repoRef,
    pullreq_number: prId
  })
  const { data: activityData } = useListPullReqActivitiesQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })

  const [activities, setActivities] = useState(activityData)
  const approvedEvaluations = reviewers?.filter(evaluation => evaluation.review_decision === 'approved')
  const latestApprovalArr = approvedEvaluations?.filter(
    approved => !checkIfOutdatedSha(approved.sha, pullReqMetadata?.source_sha as string)
  )
  const changeReqEvaluations = reviewers?.filter(evaluation => evaluation.review_decision === 'changereq')
  const changeReqReviewer =
    changeReqEvaluations && !isEmpty(changeReqEvaluations)
      ? capitalizeFirstLetter(
          changeReqEvaluations[0].reviewer?.display_name || changeReqEvaluations[0].reviewer?.uid || ''
        )
      : 'Reviewer'
  const codeOwnerChangeReqEntries = findChangeReqDecisions(
    codeOwners?.evaluation_entries,
    CodeOwnerReqDecision.CHANGEREQ
  )
  const codeOwnerPendingEntries = findWaitingDecisions(codeOwners?.evaluation_entries)
  const codeOwnerApprovalEntries = findChangeReqDecisions(codeOwners?.evaluation_entries, CodeOwnerReqDecision.APPROVED)
  const latestCodeOwnerApprovalArr = codeOwnerApprovalEntries
    ?.map(entry => {
      // Filter the owner_evaluations for 'changereq' decisions
      const entryEvaluation = entry?.owner_evaluations.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (evaluation: any) => !checkIfOutdatedSha(evaluation?.review_sha, pullReqMetadata?.source_sha as string)
      )
      // If there are any 'changereq' decisions, return the entry along with them
      if (entryEvaluation && entryEvaluation?.length > 0) {
        return { entryEvaluation }
      }
    }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((entry: any) => entry !== null && entry !== undefined) // Filter out the null entries

  useEffect(() => {
    refetchCodeOwners()
  }, [pullReqMetadata, pullReqMetadata?.title, pullReqMetadata?.state, pullReqMetadata?.source_sha])

  // If you need to update activities when activityData changes, use useEffect
  useEffect(() => {
    setActivities(activityData)
  }, [activityData])
  const currentUser = 'Default'

  let count = 5
  const handleSaveComment = (comment: string, parentId?: number) => {
    // Create a temporary comment object

    const newComment: TypesPullReqActivity = {
      id: parentId, // Temporary ID
      author: { display_name: currentUser }, // Replace with actual user data
      created: Date.now(),
      edited: Date.now(),
      updated: Date.now(),
      deleted: 0,
      code_comment: undefined,
      text: comment,
      payload: {
        message: comment,
        parent_id: parentId,
        author: { display_name: currentUser },
        id: count, // Temporary ID
        created: Date.now(),
        edited: Date.now(),
        updated: Date.now(),
        deleted: 0,
        code_comment: undefined,
        text: comment
      }
    }
    count = count + 1

    // Update the state locally
    // setActivities(prevData => [...(prevData || []), newComment])

    // Persist the new comment to the API
    commentCreatePullReq({ repo_ref: repoRef, pullreq_number: prId, body: { text: comment, parent_id: parentId } })
      .then(() => {
        refetchActivities()
        // TODO: set response after saving the comment to update the local state with the new comment data
        // Update the state with the response from the API
        // setMockActivities(prevData => prevData.map(item => (item.id === newComment.id ? response.data : item)))
      })
      .catch(error => {
        // Handle error (e.g., remove the temporary comment or show an error message)
        setActivities(prevData => prevData?.filter(item => item.id !== newComment.id))
        console.error('Failed to save comment:', error)
      })
  }

  const changesInfo = extractInfoForCodeOwnerContent({
    approvedEvaluations,
    reqNoChangeReq: prPanelData?.atLeastOneReviewerRule,
    reqCodeOwnerApproval: prPanelData?.reqCodeOwnerApproval,
    minApproval: prPanelData?.minApproval,
    reqCodeOwnerLatestApproval: prPanelData?.reqCodeOwnerLatestApproval,
    minReqLatestApproval: prPanelData?.minReqLatestApproval,
    codeOwnerChangeReqEntries,
    codeOwnerPendingEntries,
    latestCodeOwnerApprovalArr,
    latestApprovalArr,
    codeOwnerApprovalEntries,
    changeReqReviewer,
    changeReqEvaluations
  })

  const onPRStateChanged = useCallback(() => {
    refetchCodeOwners()
    refetchPullReq()
    refetchActivities()
  }, [refetchCodeOwners])

  const handleMerge = () => {
    const payload: OpenapiMergePullReq = {
      method: 'squash' as EnumMergeMethod,
      source_sha: pullReqMetadata?.source_sha,
      // bypass_rules: bypass,
      dry_run: false
      // message: data.commitMessage
    }
    mergePullReqOp({ body: payload, repo_ref: repoRef, pullreq_number: prId }).then(() => {
      onPRStateChanged()
      setRuleViolationArr(undefined)
    })
    //todo: add catch t o show errors
    // .catch(exception => showError(getErrorMessage(exception)))
  }
  const mockPullRequestActions = [
    {
      id: '0',
      title: 'Squash and merge',
      description: 'All commits from this branch will be combined into one commit in the base branch.',
      action: handleMerge
    },
    {
      id: '1',
      title: 'Merge pull request',
      description: 'All commits from this branch will be added to the base branch via a merge commit.'
    },
    {
      id: '2',
      title: 'Rebase and merge',
      description: 'All commits from this branch will be rebased and added to the base branch.'
    }
  ]
  if (prLoading) {
    return <SkeletonList />
  }
  return (
    <>
      <FullWidth2ColumnLayout
        leftColumn={
          <>
            {/* TODO: fix handleaction for comment section in panel */}
            <PullRequestPanel
              changesInfo={{
                header: changesInfo?.title,
                content: changesInfo?.statusMessage,
                status: changesInfo?.statusIcon
              }}
              checksInfo={{
                header: pullReqChecksDecision.checkInfo.title,
                content: pullReqChecksDecision.summaryText,
                status: pullReqChecksDecision?.checkInfo.status as EnumCheckStatus
              }}
              commentsInfo={prPanelData?.commentsInfoData}
              ruleViolation={prPanelData.ruleViolation}
              // @ts-expect-error remove "@ts-expect-error" once CodeServiceClient Response for useChecksPullReqQuery is fixed
              checks={pullReqChecksDecision?.data?.checks}
              pullReqMetadata={pullReqMetadata}
              PRStateLoading={prPanelData?.PRStateLoading}
              // TODO: add dry merge check into pr context
              conflictingFiles={prPanelData?.conflictingFiles}
              approvedEvaluations={approvedEvaluations}
              changeReqEvaluations={changeReqEvaluations}
              codeOwners={codeOwners}
              latestApprovalArr={latestApprovalArr}
              reqNoChangeReq={prPanelData?.atLeastOneReviewerRule}
              changeReqReviewer={changeReqReviewer}
              codeOwnerChangeReqEntries={codeOwnerChangeReqEntries}
              reqCodeOwnerApproval={prPanelData?.reqCodeOwnerApproval}
              reqCodeOwnerLatestApproval={prPanelData?.reqCodeOwnerLatestApproval}
              codeOwnerPendingEntries={codeOwnerPendingEntries}
              codeOwnerApprovalEntries={codeOwnerApprovalEntries}
              latestCodeOwnerApprovalArr={latestCodeOwnerApprovalArr}
              minApproval={prPanelData?.minApproval}
              minReqLatestApproval={prPanelData?.minReqLatestApproval}
              actions={mockPullRequestActions}
              resolvedCommentArr={prPanelData?.resolvedCommentArr}
              requiresCommentApproval={prPanelData?.requiresCommentApproval}
            />
            <Spacer size={9} />
            <PullRequestFilters
              activityFilters={activityFilters}
              dateFilters={dateFilters}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              setActivityFilter={setActivityFilter}
              setDateOrderSort={setDateOrderSort}
            />
            <Spacer size={6} />
            <PullRequestOverview
              data={activities?.map((item: TypesPullReqActivity) => {
                return {
                  author: item?.author,
                  created: item?.created,
                  deleted: item?.deleted,
                  edited: item?.edited,
                  id: item?.id,
                  kind: item?.kind,
                  mentions: item?.mentions,
                  metadata: item?.metadata,
                  order: item?.order,
                  parent_id: item?.parent_id,
                  payload: item as TypesPullReqActivity,
                  pullreq_id: item?.pullreq_id,
                  repo_id: item?.repo_id,
                  resolved: item?.resolved,
                  resolver: item?.resolver,
                  sub_order: item?.sub_order,
                  text: item?.text,
                  type: item?.type,
                  updated: item?.updated
                }
              })}
              pullReqMetadata={pullReqMetadata}
              activityFilter={activityFilter}
              dateOrderSort={dateOrderSort}
              diffData={diffdata}
              handleSaveComment={handleSaveComment}
              currentUser={currentUser}
            />
            <Spacer size={9} />
            <PullRequestCommentBox currentUser={currentUser} onSaveComment={handleSaveComment} />
            <Spacer size={9} />
          </>
        }
        rightColumn={
          <PullRequestSideBar
            // repoMetadata={undefined}
            pullRequestMetadata={{ source_sha: pullReqMetadata?.source_sha as string }}
            processReviewDecision={processReviewDecision}
            refetchReviewers={refetchReviewers}
            reviewers={reviewers?.map((val: TypesPullReqReviewer) => ({
              reviewer: { display_name: val.reviewer?.display_name, id: val.reviewer?.id },
              review_decision: val.review_decision,
              sha: val.sha
            }))}
          />
        }
      />
    </>
  )
}
