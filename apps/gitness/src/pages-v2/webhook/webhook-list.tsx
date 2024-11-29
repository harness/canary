import { useEffect } from 'react'

import { parseAsInteger, useQueryState } from 'nuqs'

import { useListRepoWebhooksQuery } from '@harnessio/code-service-client'
import { SandboxWebhookListPage } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { useWebhookStore } from './stores/webhook-store'

export default function WebhookListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setWebhooks, page, setPage } = useWebhookStore()

  /* Query and Pagination */
  const [query] = useDebouncedQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: webhookData, headers } = {} } = useListRepoWebhooksQuery(
    {
      queryParams: { page, query },
      repo_ref: repoRef
    },
    { retry: false }
  )
  //TODO: add delete in another pr
  //   const queryClient = useQueryClient()
  //   const [isDeleteWebhookDialogOpen, setIsDeleteWebhookDialogOpen] = useState(false)
  //   const closeDeleteWebhookDialog = () => setIsDeleteWebhookDialogOpen(false)
  //   const [deleteWebhookId, setDeleteWebhookId] = useState<string | null>(null)

  //   const openDeleteWebhookDialog = (id: number) => {
  //     setIsDeleteWebhookDialogOpen(true)
  //     setDeleteWebhookId(id.toString())
  //   }

  //   const { mutate: deleteWebhook } = useDeleteRepoWebhookMutation(
  //     { repo_ref: repoRef, webhook_identifier: 0 },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries({ queryKey: ['listWebhooks', repoRef] })
  //         closeDeleteWebhookDialog()
  //       }
  //     }
  //   )

  //   const handleDeleteWebhook = (id: string) => {
  //     const webhook_identifier = parseInt(id)

  //     deleteWebhook({ repo_ref: repoRef, webhook_identifier: webhook_identifier })
  //   }

  useEffect(() => {
    if (webhookData) {
      setWebhooks(webhookData, headers)
    }
  }, [webhookData, headers, setWebhooks])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

  return <SandboxWebhookListPage useWebhookStore={useWebhookStore} />
}
