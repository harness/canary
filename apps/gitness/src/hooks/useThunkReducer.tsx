import { Reducer, useCallback, useRef, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type NotFunction<A> = Exclude<A, Function>
export type ThunkAction<S, A> = (dispatch: DispatchFunc<S, A>, getState: () => S) => void
export type VariantAction<S, A> = NotFunction<A> | ThunkAction<S, A>
export type DispatchFunc<S, A> = (action: VariantAction<S, A>) => void

export function useThunkReducer<S extends object, A>(
  reducer: Reducer<S, A>,
  initialState: S
): [S, DispatchFunc<S, A>, () => S] {
  const [hookState, setHookState] = useState(initialState)

  const state = useRef(hookState)
  const getState = useCallback(() => state.current, [state])
  const setState = useCallback(
    (newState: S) => {
      state.current = newState
      setHookState(newState)
    },
    [state, setHookState]
  )

  const reduce = useCallback(
    (action: A) => {
      return reducer(getState(), action)
    },
    [reducer, getState]
  )

  const dispatch: DispatchFunc<S, A> = useCallback(
    action => {
      if (typeof action === 'function') {
        return (action as ThunkAction<S, A>)(dispatch, getState)
      } else {
        setState(reduce(action))
      }
    },
    [getState, setState, reduce]
  )

  return [hookState, dispatch, () => state.current]
}

export default useThunkReducer
