import { useCallback, useEffect, useState } from 'react'

import { FilterValue, SavedView, SortValue, ValidationResult, ViewManagement } from '@components/filters/types'

interface UseViewManagementProps {
  storageKey: string
  setActiveFilters: (filters: FilterValue[]) => void
  setActiveSorts: (sorts: SortValue[]) => void
}

/**
 * Compares two arrays for equality in the context of filter and sort states
 * Used to detect changes in filter/sort configurations and view states
 *
 * @param {Array} arr1 - First array (usually current filters/sorts)
 * @param {Array} arr2 - Second array (usually saved view filters/sorts)
 * @returns {boolean} Whether the arrays have the same elements regardless of order
 *
 * @example
 * // Used to detect changes in view state
 * const hasViewChanges = !areArraysEqual(currentView.filters, activeFilters) ||
 *                       !areArraysEqual(currentView.sorts, activeSorts)
 */
export const areArraysEqual = (arr1: any[], arr2: any[]) => {
  if (!arr1 || !arr2) return false
  if (arr1.length !== arr2.length) return false

  // Sort arrays to ensure order-independent comparison
  const sorted1 = [...arr1].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  const sorted2 = [...arr2].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))

  return JSON.stringify(sorted1) === JSON.stringify(sorted2)
}

/**
 * Hook for managing filter views state and operations
 * Handles saving, loading, updating and validating filter views
 *
 * @param storageKey - Unique key for localStorage
 * @param setActiveFilters - Callback to update active filters
 * @param setActiveSorts - Callback to update active sorts
 */
export const useViewManagement = ({
  storageKey,
  setActiveFilters,
  setActiveSorts
}: UseViewManagementProps): ViewManagement => {
  const [savedViews, setSavedViews] = useState<SavedView[]>([])
  const [currentView, setCurrentView] = useState<SavedView | null>(null)

  /**
   * Applies a view by updating current filters and sorts
   * Saves the current view ID to localStorage
   */
  const applyView = useCallback(
    (view: SavedView) => {
      setCurrentView(view)
      setActiveFilters(view.filters)
      setActiveSorts(view.sorts)
      localStorage.setItem(`${storageKey}-current-view`, view.id)
    },
    [storageKey, setActiveFilters, setActiveSorts]
  )

  /**
   * Loads saved views from localStorage on mount
   * Restores the last active view if available
   */
  useEffect(() => {
    try {
      const savedViewsString = localStorage.getItem(`${storageKey}-views`)
      const lastViewId = localStorage.getItem(`${storageKey}-current-view`)

      // First update savedViews
      const views = savedViewsString ? JSON.parse(savedViewsString) : []
      setSavedViews(views)

      // Check currentView in any case
      if (lastViewId) {
        const lastView = views.find((v: SavedView) => v.id === lastViewId)
        if (lastView) {
          applyView(lastView)
        } else {
          // If view not found - clear it
          setCurrentView(null)
          localStorage.removeItem(`${storageKey}-current-view`)
        }
      }
    } catch (error) {
      console.error('Error loading saved views:', error)
      // Clear on error as well
      setCurrentView(null)
      localStorage.removeItem(`${storageKey}-current-view`)
    }
  }, [storageKey, applyView])

  /**
   * Validates a view name for emptiness and uniqueness
   * @returns ValidationResult with isValid flag and optional error message
   */
  const validateViewName = (name: string, currentName?: string): ValidationResult => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return {
        isValid: false,
        error: 'Name cannot be empty'
      }
    }

    if (currentName?.trim().toLowerCase() === trimmedName.toLowerCase()) {
      return { isValid: true }
    }

    return { isValid: true }
  }

  /**
   * Returns a Set of existing view names in lowercase for validation
   */
  const getExistingNames = useCallback((views: SavedView[]): Set<string> => {
    return new Set(views.map(v => v.name.trim().toLowerCase()))
  }, [])

  /**
   * Checks for validation errors in views list
   * Currently checks for duplicate names and empty names
   */
  const hasViewErrors = useCallback((views: SavedView[]): boolean => {
    const duplicatesMap = new Map<string, boolean>()

    return views.some(view => {
      const trimmedName = view.name.trim().toLowerCase()

      if (!trimmedName) return true

      if (duplicatesMap.has(trimmedName)) {
        return true
      }

      duplicatesMap.set(trimmedName, true)
      return false
    })
  }, [])

  /**
   * Prepares views for saving by trimming names
   */
  const prepareViewsForSave = useCallback((views: SavedView[]): SavedView[] => {
    return views.map(view => ({
      ...view,
      name: view.name.trim()
    }))
  }, [])

  /**
   * Creates and saves a new view
   * Updates localStorage and sets it as current view
   */
  const saveView = useCallback(
    (name: string, filters: FilterValue[], sorts: SortValue[]) => {
      const newView: SavedView = {
        id: crypto.randomUUID(),
        name,
        filters,
        sorts
      }

      setSavedViews(prev => {
        const updated = [...prev, newView]
        localStorage.setItem(`${storageKey}-views`, JSON.stringify(updated))
        return updated
      })

      setCurrentView(newView)
      localStorage.setItem(`${storageKey}-current-view`, newView.id)
    },
    [storageKey]
  )

  /**
   * Updates an existing view
   * Updates both savedViews and currentView if necessary
   */
  const updateView = useCallback(
    (updatedView: SavedView) => {
      setSavedViews(prev => {
        const updatedViews = prev.map(view => (view.id === updatedView.id ? updatedView : view))
        localStorage.setItem(`${storageKey}-views`, JSON.stringify(updatedViews))
        return updatedViews
      })
      setCurrentView(updatedView)
      localStorage.setItem(`${storageKey}-current-view`, updatedView.id)
    },
    [storageKey]
  )

  /**
   * Deletes a view and updates localStorage
   * Clears currentView if deleted view was active
   */
  const deleteView = useCallback(
    (viewId: string) => {
      setSavedViews(prev => {
        const updated = prev.filter(v => v.id !== viewId)
        localStorage.setItem(`${storageKey}-views`, JSON.stringify(updated))
        return updated
      })

      if (currentView?.id === viewId) {
        setCurrentView(null)
        localStorage.removeItem(`${storageKey}-current-view`)
      }
    },
    [currentView, storageKey]
  )

  /**
   * Renames an existing view
   * Updates both savedViews and currentView if necessary
   */
  const renameView = useCallback(
    (viewId: string, newName: string) => {
      setSavedViews(prev => {
        const updated = prev.map(v => (v.id === viewId ? { ...v, name: newName } : v))
        localStorage.setItem(`${storageKey}-views`, JSON.stringify(updated))
        return updated
      })

      setCurrentView(prev => (prev?.id === viewId ? { ...prev, name: newName } : prev))
    },
    [storageKey]
  )

  /**
   * Updates the order of views after drag and drop
   * Persists new order to localStorage
   */
  const updateViewsOrder = useCallback(
    (newViews: SavedView[]) => {
      setSavedViews(newViews)
      localStorage.setItem(`${storageKey}-views`, JSON.stringify(newViews))
    },
    [storageKey]
  )

  /**
   * Checks if a view name already exists
   * @param excludeId - Optional ID to exclude from check (for renaming)
   */
  const checkNameExists = useCallback(
    (name: string, excludeId?: string) => {
      return savedViews.some(
        view => view.name.toLowerCase().trim() === name.toLowerCase().trim() && view.id !== excludeId
      )
    },
    [savedViews]
  )

  /**
   * Validates view name changes in real-time
   * Used for inline editing validation
   */
  const validateViewNameChange = useCallback((newName: string, currentName: string, existingNames: Set<string>) => {
    const trimmedName = newName.trim().toLowerCase()
    const currentViewName = currentName.trim().toLowerCase()

    const hasError = Boolean(trimmedName && existingNames.has(trimmedName) && trimmedName !== currentViewName)

    return {
      hasError,
      errorMessage: hasError ? 'A view with this name already exists' : undefined
    }
  }, [])

  /**
   * Checks if the list of views has been modified
   * Used in ManageViews to detect changes in view order or names
   */
  const hasViewListChanges = useCallback((currentViews: SavedView[], originalViews: SavedView[]): boolean => {
    if (currentViews.length !== originalViews.length) return true

    return currentViews.some((currentView, index) => {
      const originalView = originalViews[index]
      return !originalView || currentView.id !== originalView.id || currentView.name.trim() !== originalView.name.trim()
    })
  }, [])

  /**
   * Checks if current filters/sorts differ from the saved view
   * Used to detect unsaved changes in current view
   */
  const hasActiveViewChanges = useCallback(
    (activeFilters: FilterValue[], activeSorts: SortValue[]): boolean => {
      if (!currentView) return false
      return !areArraysEqual(currentView.filters, activeFilters) || !areArraysEqual(currentView.sorts, activeSorts)
    },
    [currentView]
  )

  return {
    validateViewName,
    hasViewErrors,
    hasViewListChanges,
    getExistingNames,
    prepareViewsForSave,
    saveView,
    updateView,
    deleteView,
    renameView,
    applyView,
    updateViewsOrder,
    savedViews,
    currentView,
    setCurrentView,
    checkNameExists,
    validateViewNameChange,
    hasActiveViewChanges
  }
}
