/**
 * ESM implementation of `use-sync-external-store/shim` for library builds.
 * The published package resolves to CJS that calls `require("react")`; Rolldown inlines that into
 * dist with a runtime `require` that breaks Astro SSR (chunks load as ESM, no `require`).
 */

import * as React from 'react'

function is(x: unknown, y: unknown): boolean {
  return (x === y && (x !== 0 || 1 / Number(x) === 1 / Number(y))) || (x !== x && y !== y)
}

const objectIs = typeof Object.is === 'function' ? Object.is : is

type Inst<T> = { value: T; getSnapshot: () => T }

function checkIfSnapshotChanged<T>(inst: Inst<T>): boolean {
  const latestGetSnapshot = inst.getSnapshot
  const prevValue = inst.value
  try {
    const nextValue = latestGetSnapshot()
    return !objectIs(prevValue, nextValue)
  } catch {
    return true
  }
}

function useSyncExternalStoreWithShim<T>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => T
): T {
  const value = getSnapshot()
  const [state, setState] = React.useState(() => ({
    inst: { value, getSnapshot } as Inst<T>
  }))
  const { inst } = state

  React.useLayoutEffect(() => {
    inst.value = value
    inst.getSnapshot = getSnapshot
    if (checkIfSnapshotChanged(inst)) {
      setState({ inst })
    }
  }, [subscribe, value, getSnapshot])

  React.useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      setState({ inst })
    }
    return subscribe(() => {
      if (checkIfSnapshotChanged(inst)) {
        setState({ inst })
      }
    })
  }, [subscribe])

  React.useDebugValue(value)
  return value
}

function useSyncExternalStoreServer<T>(_subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => T): T {
  return getSnapshot()
}

const useShim =
  typeof window === 'undefined' ||
  typeof window.document === 'undefined' ||
  typeof window.document.createElement === 'undefined'
    ? useSyncExternalStoreServer
    : useSyncExternalStoreWithShim

const ReactCompat = React as typeof React & {
  useSyncExternalStore?: typeof useShim
}

export const useSyncExternalStore =
  ReactCompat.useSyncExternalStore !== undefined ? ReactCompat.useSyncExternalStore : useShim
