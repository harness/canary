import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Button, IconV2, Layout, Popover, Text } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

import { TypesPullReqActivityReaction } from '../../pull-request-details-types'

const REACTION_EMOJIS: Record<string, { emoji: string; label: string }> = {
  plusone: { emoji: '👍', label: 'Thumbs up' },
  minusone: { emoji: '👎', label: 'Thumbs down' },
  smile: { emoji: '😄', label: 'Smile' },
  tada: { emoji: '🎉', label: 'Tada' },
  confused: { emoji: '😕', label: 'Confused' },
  heart: { emoji: '❤️', label: 'Heart' },
  rocket: { emoji: '🚀', label: 'Rocket' },
  eyes: { emoji: '👀', label: 'Eyes' }
}

const SUPPORTED_EMOJIS = Object.keys(REACTION_EMOJIS)

const REACTION_CHIP_BASE = 'min-w-0 rounded-full border border-solid px-cn-xs py-cn-3xs font-normal shadow-none'

const reactionChipClassName = (userReacted: boolean) =>
  cn(
    REACTION_CHIP_BASE,
    userReacted
      ? 'border-cn-brand bg-cn-brand-outline hover:bg-cn-brand-outline-hover'
      : 'border-cn-gray-outline bg-cn-gray-outline hover:bg-cn-hover'
  )

interface ReactionChipProps {
  emojiChar: string
  count?: number
  userReacted: boolean
  onClick: () => void
  tooltipContent?: string
}

const ReactionChip: FC<ReactionChipProps> = ({ emojiChar, count, userReacted, onClick, tooltipContent }) => (
  <Button
    variant="ghost"
    size="xs"
    className={cn(reactionChipClassName(userReacted), count !== undefined && 'gap-cn-3xs')}
    onClick={onClick}
    aria-pressed={userReacted}
    tooltipProps={tooltipContent ? { content: tooltipContent } : undefined}
  >
    <span aria-hidden="true" className="text-lg leading-none select-none">
      {emojiChar}
    </span>
    {count !== undefined && (
      <Text
        variant="caption-normal"
        color={userReacted ? 'brand' : 'foreground-2'}
        className="tabular-nums leading-none"
      >
        {count}
      </Text>
    )}
  </Button>
)

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

  useEffect(() => {
    setLocalReactions(initialReactions ?? [])
  }, [initialReactions])

  const groups = useMemo(() => {
    const map = new Map<string, ReactionGroup>()
    for (const r of localReactions) {
      if (!r.emoji) continue
      const existing = map.get(r.emoji) ?? { count: 0, userReacted: false }
      map.set(r.emoji, {
        count: existing.count + 1,
        userReacted: existing.userReacted || r.author?.uid === currentUserUid
      })
    }
    return map
  }, [localReactions, currentUserUid])

  const handleToggle = useCallback(
    (emoji: string) => {
      let snapshot: TypesPullReqActivityReaction[] = []
      let adding = false

      setLocalReactions(prev => {
        snapshot = prev
        const alreadyReacted = prev.some(r => r.emoji === emoji && r.author?.uid === currentUserUid)
        adding = !alreadyReacted

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
          return [...prev, optimisticReaction]
        }

        const idx = prev.findIndex(r => r.emoji === emoji && r.author?.uid === currentUserUid)
        if (idx === -1) return prev
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
      })

      setPickerOpen(false)

      onReactionToggle?.(commentId, emoji, adding)?.catch(() => {
        setLocalReactions(snapshot)
      })
    },
    [commentId, currentUserUid, onReactionToggle]
  )

  if (groups.size === 0 && !onReactionToggle) return null

  return (
    <Layout.Horizontal gap="2xs" align="center" wrap="wrap" className="mt-cn-md">
      {onReactionToggle && (
        <Popover.Root open={pickerOpen} onOpenChange={setPickerOpen}>
          <Popover.Trigger asChild>
            <Button iconOnly variant="outline" size="sm" className="group" tooltipProps={{ content: 'Add reaction' }}>
              <IconV2
                name="plus-circle"
                size="sm"
                color="neutral"
                className="group-hover:text-cn-brand group-focus-visible:text-cn-brand group-data-[state=open]:text-cn-brand"
              />
            </Button>
          </Popover.Trigger>
          <Popover.Content
            hideArrow
            custom
            align="start"
            className="p-0"
            onOpenAutoFocus={event => event.preventDefault()}
            onCloseAutoFocus={event => event.preventDefault()}
          >
            <div className="flex flex-wrap gap-cn-3xs p-cn-xs">
              {SUPPORTED_EMOJIS.map(emoji => {
                const { emoji: emojiChar, label } = REACTION_EMOJIS[emoji]
                const userReacted = groups.get(emoji)?.userReacted ?? false
                return (
                  <ReactionChip
                    key={emoji}
                    emojiChar={emojiChar}
                    userReacted={userReacted}
                    tooltipContent={label}
                    onClick={() => handleToggle(emoji)}
                  />
                )
              })}
            </div>
          </Popover.Content>
        </Popover.Root>
      )}

      {Array.from(groups.entries()).map(([emoji, { count, userReacted }]) => (
        <ReactionChip
          key={emoji}
          emojiChar={REACTION_EMOJIS[emoji]?.emoji ?? emoji}
          count={count}
          userReacted={userReacted}
          tooltipContent={REACTION_EMOJIS[emoji]?.label ?? emoji}
          onClick={() => handleToggle(emoji)}
        />
      ))}
    </Layout.Horizontal>
  )
}

PullRequestCommentReactions.displayName = 'PullRequestCommentReactions'
