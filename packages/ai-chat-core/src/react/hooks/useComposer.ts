import { useSyncExternalStore } from 'use-sync-external-store/shim'

import ComposerRuntime, { ComposerState } from '../../runtime/ComposerRuntime/ComposerRuntime'
import { useCurrentThread } from './useCurrentThread'

export function useComposer(): ComposerRuntime {
  const thread = useCurrentThread()
  return thread.composer
}

export function useComposerState(): ComposerState {
  const composer = useComposer()

  return useSyncExternalStore(
    callback => composer.subscribe(callback),
    () => composer.getState(),
    () => composer.getState()
  )
}
