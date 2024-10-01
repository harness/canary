import { get, orderBy } from 'lodash-es'
  diffData?: { text: string; numAdditions?: number; numDeletions?: number; data?: string; title: string; lang: string }
              const codeDiffSnapshot = [
                `diff --git a/src b/dest`,
                `new file mode 100644`,
                'index 0000000..0000000',
                `--- a/src/${get(payload, 'code_comment.path')}`,
                `+++ b/dest/${get(payload, 'code_comment.path')}`,
                `${get(payload, 'payload.title', '')} ttttt`,
                ...get(payload, 'payload.lines', [])
              ].join('\n')
                          data={codeDiffSnapshot}
                          fileName={payload?.code_comment?.path ?? ''}
                          lang={(payload?.code_comment?.path && payload?.code_comment?.path.split('.').pop()) || ''}
                                          ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                    name: ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                      ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                        .display_name || ''
                                name: ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                  ?.display_name,