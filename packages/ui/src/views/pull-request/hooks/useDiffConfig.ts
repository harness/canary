import { useReducer } from 'react'

import { DiffModeEnum } from '@git-diff-view/react'

type DiffConfig = {
  highlight: boolean
  wrap: boolean
  fontsize: number
  mode: DiffModeEnum
}

type DiffConfigAction =
  | { type: 'SET_HIGHLIGHT'; payload: boolean }
  | { type: 'SET_WRAP'; payload: boolean }
  | { type: 'SET_FONTSIZE'; payload: number }
  | { type: 'SET_MODE'; payload: DiffModeEnum }

const initialState: DiffConfig = {
  highlight: true,
  wrap: true,
  fontsize: 14,
  mode: DiffModeEnum.Unified
}

const diffConfigReducer = (state: DiffConfig, action: DiffConfigAction): DiffConfig => {
  switch (action.type) {
    case 'SET_HIGHLIGHT':
      return { ...state, highlight: action.payload }
    case 'SET_WRAP':
      return { ...state, wrap: action.payload }
    case 'SET_FONTSIZE':
      return { ...state, fontsize: action.payload }
    case 'SET_MODE':
      return { ...state, mode: action.payload }
    default:
      return state
  }
}

export const useDiffConfig = () => {
  const [state, dispatch] = useReducer(diffConfigReducer, initialState)

  const setHighlight = (v: boolean) => {
    dispatch({ type: 'SET_HIGHLIGHT', payload: v })
  }

  const setWrap = (v: boolean) => {
    dispatch({ type: 'SET_WRAP', payload: v })
  }

  const setFontSize = (v: number) => {
    dispatch({ type: 'SET_FONTSIZE', payload: v })
  }

  const setMode = (v: DiffModeEnum) => {
    dispatch({ type: 'SET_MODE', payload: v })
  }

  return {
    highlight: state.highlight,
    setHighlight,
    wrap: state.wrap,
    setWrap,
    fontsize: state.fontsize,
    setFontSize,
    mode: state.mode,
    setMode
  }
}
