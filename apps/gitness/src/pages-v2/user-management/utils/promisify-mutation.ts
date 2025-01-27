import { UsererrorError } from '@harnessio/code-service-client'

export type MutationFn<T> = (
  params: T,
  options: { onSuccess: () => void; onError: (error: UsererrorError) => void }
) => void

export const promisifyMutation = <T>(mutation: MutationFn<T>, params: T): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    mutation(params, {
      onSuccess: () => resolve(),
      onError: error => reject(error)
    })
  })
}
