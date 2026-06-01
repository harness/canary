import { FC, useCallback, useMemo, useState } from 'react'

import { Popover } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

import { TypesPullReqActivityReaction } from '../../pull-request-details-types'

const EMOJI_MAP: Record<string, string> = {
  plusone: '👍',
  minusone: '👎',
  smile: '😄',
  tada: '🎉',
  confused: '😕',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

const SUPPORTED_EMOJIS = ['plusone', 'minusone', 'smile', 'tada', 'confused', 'heart', 'rocket', 'eyes']

interface ReactionGroup {
  count: number
  userReacted: boolean
}

export interface PullRequestCommentReactionsProps {
  reactions?: TypesPullReqActivityReaction[]
  commentId: number
  currentUserUid: string
  onReactionToggle?: (commentId: number, emoji: string, add: boolean) => Promise<void>
}

export const PullRequestCommentReactions: FC<PullRequestCommentReactionsProps> = ({
  reactions: initialReactions,
  commentId,
  currentUserUid,
  onReactionToggle
}) => {
  const [localReactions, setLocalReactions] = useState<TypesPullReqActivityReaction[]>(initialReactions ?? [])
  const [pickerOpen, setPickerOpen] = useState(false)

  // Sync with incoming prop changes (e.g. after refetch)
  const [prevReactions, setPrevReactions] = useState(initialReactions)
  if (prevReactions !== initialReactions) {
    setPrevReactions(initialReactions)
    setLocalReactions(initialReactions ?? [])
  }

  const groups = useMemo(() => {
    const map = new Map<string, ReactionGroup>()
    for (const r of localReactions) {
      const existing = map.get(r.emoji) ?? { count: 0, userReacted: false }
      map.set(r.emoji, {
        count: existing.count + 1,
        userReacted: existing.userReacted || r.author.uid === currentUserUid
      })
    }
    return map
  }, [localReactions, currentUserUid])

  const handleToggle = useCallback(
    (emoji: string) => {
      const group = groups.get(emoji)
      const alreadyReacted = group?.userReacted ?? false
      const adding = !alreadyReacted

      // Snapshot current state for rollback — captures any in-flight optimistic updates too.
      let snapshot: TypesPullReqActivityReaction[] = []

      if (adding) {
        const optimisticReaction: TypesPullReqActivityReaction = {
          emoji,
          author: {
            id: 0,
            uid: currentUserUid,
            display_name: currentUserUid,
            email: '',
            type: 'user',
            created: 0,
            updated: 0
          }
        }
        setLocalReactions(prev => {
          snapshot = prev
          return [...prev, optimisticReaction]
        })
      } else {
        setLocalReactions(prev => {
          snapshot = prev
          const idx = prev.findIndex(r => r.emoji === emoji && r.author.uid === currentUserUid)
          if (idx === -1) return prev
          return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
        })
      }

      setPickerOpen(false)

      onReactionToggle?.(commentId, emoji, adding)?.catch(() => {
        setLocalReactions(snapshot)
      })
    },
    [groups, commentId, currentUserUid, onReactionToggle]
  )

  if (groups.size === 0 && !onReactionToggle) return null

  return (
    <div className="flex flex-wrap items-center gap-cn-xs mt-cn-xs">
      {Array.from(groups.entries()).map(([emoji, { count, userReacted }]) => {
        const emojiChar = EMOJI_MAP[emoji] ?? emoji
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleToggle(emoji)}
            className={cn(
              'inline-flex items-center gap-cn-3xs rounded-full px-cn-xs py-cn-3xs text-xs font-medium transition-colors',
              'border focus:outline-none focus-visible:ring-2 focus-visible:ring-cn-focus',
              userReacted
                ? 'border-cn-accent bg-cn-accent/10 text-cn-accent hover:bg-cn-accent/20'
                : 'border-cn-borders-2 bg-cn-2 text-cn-2 hover:bg-cn-3'
            )}
            aria-label={`${emojiChar} ${count} reaction${count !== 1 ? 's' : ''}, ${userReacted ? 'click to remove' : 'click to add'}`}
            aria-pressed={userReacted}
          >
            <span aria-hidden="true">{emojiChar}</span>
            <span>{count}</span>
          </button>
        )
      })}

      {onReactionToggle && (
        <Popover.Root open={pickerOpen} onOpenChange={setPickerOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full px-cn-xs py-cn-3xs text-xs border border-cn-borders-2 bg-transparent hover:bg-cn-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cn-focus"
              aria-label="Add reaction"
            >
              😊
            </button>
          </Popover.Trigger>
          <Popover.Content hideArrow custom align="start" className="p-0">
            <div className="flex flex-wrap gap-cn-3xs p-cn-xs">
              {SUPPORTED_EMOJIS.map(emoji => {
                const emojiChar = EMOJI_MAP[emoji]
                const group = groups.get(emoji)
                const userReacted = group?.userReacted ?? false
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleToggle(emoji)}
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded text-base transition-colors',
                      'hover:bg-cn-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cn-focus',
                      userReacted && 'bg-cn-accent/10'
                    )}
                    title={emoji}
                    aria-pressed={userReacted}
                  >
                    {emojiChar}
                  </button>
                )
              })}
            </div>
          </Popover.Content>
        </Popover.Root>
      )}
    </div>
  )
}

PullRequestCommentReactions.displayName = 'PullRequestCommentReactions'
