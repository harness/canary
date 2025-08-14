import { useCallback, useReducer } from 'react'

enum ActionTypes {
  SET_VIOLATION = 'SET_VIOLATION',
  SET_BYPASSED = 'SET_BYPASSED',
  SET_BYPASSABLE = 'SET_BYPASSABLE',
  SET_ALL_STATES = 'SET_ALL_STATES'
}

interface ViolationState {
  violation: boolean
  bypassable: boolean
  bypassed: boolean
}

type ViolationAction =
  | { type: ActionTypes.SET_VIOLATION; payload: boolean }
  | { type: ActionTypes.SET_BYPASSED; payload: boolean }
  | { type: ActionTypes.SET_BYPASSABLE; payload: boolean }
  | { type: ActionTypes.SET_ALL_STATES; payload: Partial<ViolationState> }

const initialState: ViolationState = {
  violation: false,
  bypassable: false,
  bypassed: false
}

const reducer = (state: ViolationState, action: ViolationAction): ViolationState => {
  switch (action.type) {
    case ActionTypes.SET_VIOLATION:
      return { ...state, violation: action.payload }
    case ActionTypes.SET_BYPASSABLE:
      return { ...state, bypassable: action.payload }
    case ActionTypes.SET_BYPASSED:
      return { ...state, bypassed: action.payload }
    case ActionTypes.SET_ALL_STATES:
      return {
        ...state,
        violation: action.payload.violation !== undefined ? action.payload.violation : state.violation,
        bypassable: action.payload.bypassable !== undefined ? action.payload.bypassable : state.bypassable,
        bypassed: action.payload.bypassed !== undefined ? action.payload.bypassed : state.bypassed
      }
    default:
      return state
  }
}

export const useRuleViolationCheck = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const setViolation = useCallback(
    (value: boolean) => {
      dispatch({ type: ActionTypes.SET_VIOLATION, payload: value })
    },
    [dispatch]
  )

  const setBypassable = useCallback(
    (value: boolean) => {
      dispatch({ type: ActionTypes.SET_BYPASSABLE, payload: value })
    },
    [dispatch]
  )

  const setBypassed = useCallback(
    (value: boolean) => {
      dispatch({ type: ActionTypes.SET_BYPASSED, payload: value })
    },
    [dispatch]
  )

  const setAllStates = useCallback(
    (payload: Partial<ViolationState>) => {
      dispatch({ type: ActionTypes.SET_ALL_STATES, payload })
    },
    [dispatch]
  )

  const resetViolation = useCallback(() => {
    dispatch({ type: ActionTypes.SET_ALL_STATES, payload: { violation: false, bypassable: false, bypassed: false } })
  }, [dispatch])

  return {
    violation: state.violation,
    setViolation,
    bypassable: state.bypassable,
    setBypassable,
    bypassed: state.bypassed,
    setBypassed,
    setAllStates,
    resetViolation
  }
}
