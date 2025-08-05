import { useCallback, useEffect, useReducer } from 'react'

import { PrincipalsMentionMap } from '@/views'

export interface CommentState {
  editMode: boolean
  isDeleting: boolean
  showReplyBox: boolean
  replyText: string
  isExpanded: boolean
  deleteError?: Error
  editComment: string
}

type CommentAction =
  | { type: 'ENTER_EDIT_MODE'; payload: { initialText: string } }
  | { type: 'EXIT_EDIT_MODE' }
  | { type: 'TOGGLE_REPLY_BOX' }
  | { type: 'SET_REPLY_TEXT'; payload: string }
  | { type: 'SET_EDIT_COMMENT'; payload: string }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_EXPANDED'; payload: boolean }
  | { type: 'START_DELETING' }
  | { type: 'STOP_DELETING' }
  | { type: 'SET_DELETE_ERROR'; payload: Error | undefined }

const initialState: CommentState = {
  editMode: false,
  isDeleting: false,
  showReplyBox: false,
  replyText: '',
  isExpanded: true,
  editComment: ''
}

function commentReducer(state: CommentState, action: CommentAction): CommentState {
  switch (action.type) {
    case 'ENTER_EDIT_MODE':
      return { ...state, editMode: true, editComment: action.payload.initialText }
    case 'EXIT_EDIT_MODE':
      return { ...state, editMode: false, editComment: '' }
    case 'TOGGLE_REPLY_BOX':
      return { ...state, showReplyBox: !state.showReplyBox }
    case 'SET_REPLY_TEXT':
      return { ...state, replyText: action.payload }
    case 'SET_EDIT_COMMENT':
      return { ...state, editComment: action.payload }
    case 'TOGGLE_EXPANDED':
      return { ...state, isExpanded: !state.isExpanded }
    case 'SET_EXPANDED':
      return { ...state, isExpanded: action.payload }
    case 'START_DELETING':
      return { ...state, isDeleting: true, deleteError: undefined }
    case 'STOP_DELETING':
      return { ...state, isDeleting: false }
    case 'SET_DELETE_ERROR':
      return { ...state, deleteError: action.payload, isDeleting: false }
    default:
      return state
  }
}

export interface UseCommentStateOptions {
  initialExpanded?: boolean
  isResolved?: boolean
  quoteReplyText?: string
}

export const useCommentState = (options: UseCommentStateOptions = {}) => {
  const { initialExpanded = true, isResolved = false, quoteReplyText } = options

  const [state, dispatch] = useReducer(commentReducer, {
    ...initialState,
    isExpanded: initialExpanded
  })

  // Set initial expanded state based on resolved status
  useEffect(() => {
    if (isResolved) {
      dispatch({ type: 'SET_EXPANDED', payload: false })
    }
  }, [isResolved])

  // Set quote reply text when provided
  useEffect(() => {
    if (quoteReplyText) {
      dispatch({ type: 'SET_REPLY_TEXT', payload: quoteReplyText })
    }
  }, [quoteReplyText])

  const actions = {
    enterEditMode: useCallback((initialText: string) => {
      dispatch({ type: 'ENTER_EDIT_MODE', payload: { initialText } })
    }, []),

    exitEditMode: useCallback(() => {
      dispatch({ type: 'EXIT_EDIT_MODE' })
    }, []),

    toggleReplyBox: useCallback(() => {
      dispatch({ type: 'TOGGLE_REPLY_BOX' })
    }, []),

    setReplyText: useCallback((text: string) => {
      dispatch({ type: 'SET_REPLY_TEXT', payload: text })
    }, []),

    setEditComment: useCallback((text: string) => {
      dispatch({ type: 'SET_EDIT_COMMENT', payload: text })
    }, []),

    toggleExpanded: useCallback(() => {
      dispatch({ type: 'TOGGLE_EXPANDED' })
    }, []),

    setExpanded: useCallback((expanded: boolean) => {
      dispatch({ type: 'SET_EXPANDED', payload: expanded })
    }, []),

    startDeleting: useCallback(() => {
      dispatch({ type: 'START_DELETING' })
    }, []),

    stopDeleting: useCallback(() => {
      dispatch({ type: 'STOP_DELETING' })
    }, []),

    setDeleteError: useCallback((error: Error | undefined) => {
      dispatch({ type: 'SET_DELETE_ERROR', payload: error })
    }, [])
  }

  return { state, actions }
}
