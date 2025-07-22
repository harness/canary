import { useMutation } from '@tanstack/react-query'

import { useAPIPath } from '../../../hooks/useAPIPath'

interface TVariables {
  resource_id: number
}

interface TData {
  resource_id: number
}

interface TError {
  message: string
}

const RESOURCE_TYPE = 'REPOSITORY'
const FAVORITE_ENDPOINT = '/api/v1/user/favorite'

interface UseFavoriteRepositoryProps {
  onSuccess?: (data: TData) => Promise<unknown> | unknown
  onMutate?: (variables: TVariables) => unknown
}

export function useFavoriteRepository({ onSuccess, onMutate }: UseFavoriteRepositoryProps) {
  const getApiPath = useAPIPath()
  const { mutate: createFavorite } = useMutation<TData, TError, TVariables>({
    mutationFn: async ({ resource_id }) => {
      const res = await fetch(getApiPath(FAVORITE_ENDPOINT), {
        method: 'POST',
        body: JSON.stringify({ resource_id, resource_type: RESOURCE_TYPE })
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw { message: errorData.message || 'Failed to favorite repository' }
      }
      return res.json()
    },
    onSuccess: data => onSuccess?.(data),
    onError: (_error: TError) => {
      /**
       * @TODO: Add error handling here
       */
    }
  })

  const { mutate: deleteFavorite } = useMutation<unknown, TError, TVariables>({
    mutationFn: async ({ resource_id }) => {
      await fetch(getApiPath(FAVORITE_ENDPOINT), {
        method: 'DELETE',
        body: JSON.stringify({ resource_id, resource_type: RESOURCE_TYPE })
      }).catch(() => ({}))
    },
    onMutate: variables => onMutate?.(variables),
    onError: (_error: TError) => {
      /**
       * @TODO: Add error handling here
       */
    }
  })

  return { createFavorite, deleteFavorite }
}
