import { forwardRef, useCallback, useMemo } from 'react'

import { MentionItem, MentionTextarea, MentionTextareaProps } from '@harnessio/ui/components'

import { PrincipalPropsType, PrincipalsMentionMap, TypesPrincipalInfo } from '../../pull-request-details-types'

interface PullRequestCommentTextareaProps
  extends Omit<MentionTextareaProps, 'items' | 'onSearchChange' | 'isLoading' | 'onValueChange'> {
  /** Callback when the text value changes */
  setValue: (value: string) => void
  /** State setter for tracking mentioned principals */
  setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  /** Props for principal search functionality */
  principalProps: PrincipalPropsType
}

export const PullRequestCommentTextarea = forwardRef<HTMLTextAreaElement, PullRequestCommentTextareaProps>(
  ({ setValue, principalProps, setPrincipalsMentionMap, onItemSelect, ...props }, ref) => {
    const { setSearchPrincipalsQuery, principals, isPrincipalsLoading } = principalProps || {}

    // Convert principals to MentionItems
    const items: MentionItem[] = useMemo(() => {
      if (!principals || !Array.isArray(principals)) return []
      return principals.map(principal => ({
        id: principal.uid || String(principal.id) || '',
        value: principal.email || '',
        label: principal.email
      }))
    }, [principals])

    const handleSearchChange = useCallback(
      (query: string) => {
        setSearchPrincipalsQuery?.(query)
      },
      [setSearchPrincipalsQuery]
    )

    const handleItemSelect = useCallback(
      (item: MentionItem) => {
        // Find the original principal and add to mention map
        const principal = principals?.find(p => p.email === item.value)
        if (principal) {
          // Map to TypesPrincipalInfo structure
          const principalInfo: TypesPrincipalInfo = {
            created: principal.created,
            display_name: principal.display_name,
            email: principal.email,
            id: principal.id,
            type: principal.type,
            uid: principal.uid,
            updated: principal.updated
          }
          setPrincipalsMentionMap(prev => ({
            ...prev,
            [principal.email || '']: principalInfo
          }))
        }
        onItemSelect?.(item)
      },
      [principals, setPrincipalsMentionMap, onItemSelect]
    )

    return (
      <MentionTextarea
        {...props}
        ref={ref}
        onValueChange={setValue}
        items={items}
        isLoading={isPrincipalsLoading}
        onSearchChange={handleSearchChange}
        onItemSelect={handleItemSelect}
        emptyMessage="User not found"
      />
    )
  }
)

PullRequestCommentTextarea.displayName = 'PullRequestCommentTextarea'
