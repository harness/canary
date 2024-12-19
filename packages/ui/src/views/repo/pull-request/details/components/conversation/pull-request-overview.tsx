import { Avatar, AvatarFallback, Button, Icon, MarkdownViewer, Text } from '@components/index'
                    key={payload?.id}
                          <div className="flex gap-x-2">
                                    <MarkdownViewer source={commentItem.payload?.payload?.text || ''} />
                                key={`${commentItem.id}-${commentItem.author}`}
                  key={payload?.id}
                        <div className="flex gap-x-2">
                          <PullRequestStatusSelect
                            refetchActivities={refetchActivities}
                            commentStatusPullReq={commentStatusPullReq}
                            comment={{
                              commentItems: commentItems
                            }}
                            pullReqMetadata={pullReqMetadata}
                            repoId={repoId}
                          />
                        </div>
                                <MarkdownViewer source={commentItem?.payload?.payload?.text || ''} />
                            key={`${commentItem.id}-${commentItem.author}-pr-comment`}