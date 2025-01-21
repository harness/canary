import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Button, Icon, Layout, Text } from '@components/index'
import { timeAgo } from '@utils/utils'

import { IconType } from '../pull-request.types'
import { getPrState } from '../utils'

type ThemeType = 'default' | 'destructive' | 'success' | 'emphasis' | 'muted' | null | undefined
interface PullRequestTitleProps {
  data: {
    title?: string
    number?: number
    merged?: number | null | undefined
    author?: { display_name?: string; email?: string }
    stats?: { commits?: number | null }
    target_branch?: string
    source_branch?: string
    created?: number
    is_draft?: boolean
    state?: string
    spaceId?: string
    repoId?: string
    description?: string
  }
  updateTitle: (title: string, description: string) => Promise<void>
}

export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({
  data: {
    title,
    number,
    merged,
    author,
    stats,
    target_branch,
    source_branch,
    created,
    is_draft,
    state,
    spaceId,
    repoId,
    description
  },
  updateTitle
}) => {
  const [original, setOriginal] = useState(title)
  const [edit, setEdit] = useState(false)
  const [val, setVal] = useState(title)
  const [err, setError] = useState('')
  // Format the parsed date as relative time from now
  const formattedTime = timeAgo(created || 0)

  const stateObject = getPrState(is_draft, merged, state)
  const submitChange = useCallback(() => {
    if (val && description) {
      updateTitle(val, description)
        .then(() => {
          setEdit(false)
          setOriginal(val)
        })
        .catch(exception => setError(exception))
    }
  }, [description, val, updateTitle])
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center">
        <h1 className="flex items-center gap-x-2.5 text-24 font-medium text-foreground-1">
          {!edit && original}
          {!edit && <span className="font-normal text-foreground-4">#{number}</span>}
          {edit ? (
            <Layout.Horizontal>
              <input
                className="rounded-md border  bg-primary-background hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                // wrapperClassName={css.input}
                value={val}
                onFocus={event => event.target.select()}
                onInput={event => setVal(event.currentTarget.value)}
                autoFocus
                onKeyDown={event => {
                  switch (event.key) {
                    case 'Enter':
                      submitChange()
                      break
                    case 'Escape': // does not work, maybe TextInput cancels ESC?
                      setEdit(false)
                      break
                  }
                }}
              />
              <Button
                variant={'default'}
                size={'sm'}
                disabled={(val || '').trim().length === 0 || title === val}
                onClick={submitChange}
              >
                Save
              </Button>
              <Button
                variant={'secondary'}
                size={'sm'}
                onClick={() => {
                  setEdit(false)
                  setVal(title)
                }}
              >
                Cancel
              </Button>
            </Layout.Horizontal>
          ) : (
            <Button
              size="icon"
              variant="custom"
              aria-label="Edit"
              onClick={() => {
                setEdit(true)
              }}
            >
              <Icon name="edit-pen" size={16} className="text-foreground-4" />
            </Button>
          )}
          {err && <Text className="text-destructive">{err}</Text>}
        </h1>
      </div>

      <div className="flex items-center gap-x-3">
        <Badge className="gap-x-1 font-normal" disableHover borderRadius="full" theme={stateObject.theme as ThemeType}>
          <Icon name={stateObject.icon as IconType} size={13} />
          {stateObject.text}
        </Badge>

        <div className="inline-flex flex-wrap items-center gap-1 text-foreground-4">
          <span className="text-foreground-1">{author?.display_name || author?.email || ''}</span>
          <span>{merged ? 'merged' : ' wants to merge'}</span>
          <span className="text-foreground-1">
            {stats?.commits} {stats?.commits === 1 ? 'commit' : 'commits'}
          </span>
          <span>into</span>
          <Badge variant="tertiary" size="md" borderRadius="base">
            <Link
              className="flex items-center gap-x-1"
              to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${target_branch}`}
            >
              <Icon name="branch" size={12} className="text-icons-9" />
              {target_branch}
            </Link>
          </Badge>
          <span>from</span>
          <Badge variant="tertiary" size="md" borderRadius="base">
            <Link
              className="flex items-center gap-x-1"
              to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/code/${source_branch}`}
            >
              <Icon name="branch" size={12} className="text-icons-9" />
              {source_branch}
            </Link>
          </Badge>
          <span className="mx-1.5 h-4 w-px bg-borders-2" />
          <span className="text-foreground-4">{formattedTime}</span>
        </div>
      </div>
    </div>
  )
}
