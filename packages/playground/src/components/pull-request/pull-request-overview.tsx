import { PullRequestStatusSelect } from './pull-request-status-select-button'
  currentUser?: { display_name?: string; uid?: string }
  refetchActivities: () => void
  dateOrderSort: { label: string; value: string } // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  commentStatusPullReq: any
  repoId: string
  handleSaveComment,
  commentStatusPullReq,
  repoId,
  refetchActivities,
  currentUser
      case PRCommentFilterType.MY_COMMENTS: {
        const allCommentBlock = blocks?.filter(_activities => !isSystemComment(_activities))
        const userCommentsOnly = allCommentBlock?.filter(_activities => {
          const userCommentReply = _activities?.filter(
            authorIsUser => currentUser?.uid && authorIsUser.payload?.author?.uid === currentUser?.uid
          )
          return userCommentReply.length !== 0
        })
        return userCommentsOnly
      }
    handleSaveComment,
    activityFilter,
    currentUser?.uid

          {activityFilter.value === PRCommentFilterType.SHOW_EVERYTHING && (
            <PullRequestDescBox
              createdAt={pullReqMetadata?.created}
              isLast={!(activityBlocks?.length > 0)}
              author={pullReqMetadata?.author?.display_name}
              prNum={`#${pullReqMetadata?.number}`}
              description={pullReqMetadata?.description}
            />
          )}
                          <div className="flex" key={`${index}-${payload.id}`}>
                            <PullRequestStatusSelect
                              refetchActivities={refetchActivities}
                              commentStatusPullReq={commentStatusPullReq}
                              comment={{ commentItems: commentItems }}
                              pullReqMetadata={pullReqMetadata}
                              repoId={repoId}
                            />
                  titleClassName="!flex max-w-full"
                      description: (
                        <div className="flex space-x-4">
                          <div className="pr-2">{payload?.created && `commented ${timeAgo(payload?.created)}`} </div>
                        </div>
                      ),
                      selectStatus: (
                        <PullRequestStatusSelect
                          refetchActivities={refetchActivities}
                          commentStatusPullReq={commentStatusPullReq}
                          comment={{
                            commentItems: commentItems
                          }}
                          pullReqMetadata={pullReqMetadata}
                          repoId={repoId}
                        />
                      )
  }, [data, handleSaveComment, pullReqMetadata, activityFilter, currentUser])