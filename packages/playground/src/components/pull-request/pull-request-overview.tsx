  currentUser?: string
  dateOrderSort: { label: string; value: string }
  handleSaveComment
      // case PRCommentFilterType.MY_COMMENTS: {
      //   const allCommentBlock = blocks?.filter(_activities => !isSystemComment(_activities))
      //   const userCommentsOnly = allCommentBlock?.filter(_activities => {
      //     const userCommentReply = _activities?.filter(
      //       authorIsUser => currentUser?.uid && authorIsUser.payload?.author?.uid === currentUser?.uid
      //     )
      //     return userCommentReply.length !== 0
      //   })
      //   return userCommentsOnly
      // }
    handleSaveComment
    // activityFilter
    // currentUser?.uid
          <PullRequestDescBox
            createdAt={pullReqMetadata?.created}
            isLast={!(activityBlocks?.length > 0)}
            author={pullReqMetadata?.author?.display_name}
            prNum={`#${pullReqMetadata?.number}`}
            description={pullReqMetadata?.description}
          />
                          <div className="flex">
                            <Text size={1} className="flex items-center gap-1 pr-2" color={'tertiaryBackground'}>
                              Resolved
                              <Icon size={14} name="chevron-down" />
                            </Text>
                      description: payload?.created && `commented ${timeAgo(payload?.created)}`
  }, [data, handleSaveComment, pullReqMetadata])