import { useEffect, useRef, useState } from 'react'

import {
  createLoadingBarController,
  loadingBar,
  type LoadingBarController,
  type LoadingBarOptions,
  type LoadingBarState
} from './loading-bar-controller'

/** Subscribes to a loading bar controller (the shared one by default). */
export function useLoadingBar(controller: LoadingBarController = loadingBar): LoadingBarState {
  const [state, setState] = useState<LoadingBarState>(() => controller.getSnapshot())

  useEffect(() => {
    const sync = () => setState(controller.getSnapshot())
    // The state may have changed between the first render and the subscription.
    sync()
    return controller.subscribe(sync)
  }, [controller])

  return state
}

/**
 * Keeps the loading bar running while `active` is true, e.g. `useLoadingBarTask(isLoading)`.
 * Also completes the work on unmount. Pass a `key` to make the work identifiable/idempotent.
 */
export function useLoadingBarTask(active: boolean, key?: string, controller: LoadingBarController = loadingBar): void {
  useEffect(() => {
    if (!active) return
    const id = controller.start(key)
    return () => controller.done(id)
  }, [active, key, controller])
}

/**
 * Runs a promise (or a function returning one) with the loading bar active until it settles,
 * regardless of whether it resolves or rejects. Returns the original result.
 */
export async function withLoadingBar<T>(
  task: Promise<T> | (() => Promise<T>),
  key?: string,
  controller: LoadingBarController = loadingBar
): Promise<T> {
  const id = controller.start(key)
  try {
    return await (typeof task === 'function' ? task() : task)
  } finally {
    controller.done(id)
  }
}

/**
 * Creates a controller scoped to the calling component, for a bar inside a card, tab, accordion item, etc.
 * The controller is stable across renders; options are read once. It is reset when the component unmounts.
 */
export function useLoadingBarController(options?: LoadingBarOptions): LoadingBarController {
  const ref = useRef<LoadingBarController>()
  if (!ref.current) ref.current = createLoadingBarController(options)
  const controller = ref.current

  useEffect(() => () => controller.reset(), [controller])

  return controller
}
