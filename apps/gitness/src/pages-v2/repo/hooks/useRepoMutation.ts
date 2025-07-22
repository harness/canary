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
    mutationFn: ({ resource_id }) =>
      fetch(getApiPath(FAVORITE_ENDPOINT), {
        method: 'POST',
        body: JSON.stringify({ resource_id, resource_type: RESOURCE_TYPE })
      }).then(res => res.json()),
    onSuccess: data => onSuccess?.(data)
  })

  const { mutate: deleteFavorite } = useMutation<unknown, TError, TVariables>({
    mutationFn: ({ resource_id }) =>
      fetch(getApiPath(FAVORITE_ENDPOINT), {
        method: 'DELETE',
        body: JSON.stringify({ resource_id, resource_type: RESOURCE_TYPE })
      }).then(res => res.json()),
    onMutate: variables => onMutate?.(variables)
  })

  return { createFavorite, deleteFavorite }
}
