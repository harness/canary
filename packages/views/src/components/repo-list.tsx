import { Badge, Icon, StackedList } from '@harnessio/canary'
import React from 'react'

export interface Repo {
  id: number
  name?: string
  private: boolean
  forks?: number
  pulls?: number
  timestamp?: string
  description?: string
  stars?: number
}

export interface PageProps {
  repos?: Repo[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
}

const Stats = ({ stars, forks, pulls }: { stars?: number; forks: number; pulls: number }) => (
  <div className="flex gap-3 justify-end items-center select-none font-medium">
    <span className="flex gap-1.5 items-center">
      <Icon width={16} name="star" className="text-tertiary-background" />
      <span className="text-primary text-xs font-normal">{stars || 0}</span>
    </span>
    <span className="flex gap-1.5 items-center">
      <Icon size={16} name="pull" className="text-tertiary-background" />
      <span className="text-primary text-xs font-normal">{forks || 0}</span>
    </span>
    <span className="flex gap-1.5 items-center">
      <Icon size={16} name="pull" className="text-tertiary-background" />
      <span className="text-primary text-xs font-normal">{pulls || 0}</span>
    </span>
  </div>
)

const Title = ({ title, isPrivate }: { title: string; isPrivate: boolean }) => (
  <div className="inline-flex gap-2 items-center">
    {title}
    <Badge size="sm" disableHover borderRadius="full" theme={isPrivate ? 'muted' : 'success'}>
      {isPrivate ? 'Private' : 'Public'}
    </Badge>
  </div>
)

export function RepoList({ repos, LinkComponent }: PageProps) {
  return (
    <>
      {repos && repos.length > 0 && (
        <StackedList.Root>
          {repos.map((repo, repo_idx) => (
            <LinkComponent to={repo.name ?? '/'}>
              <StackedList.Item key={repo.name} isLast={repos.length - 1 === repo_idx}>
                <StackedList.Field
                  description={repo.description}
                  title={<Title title={repo.name ?? ''} isPrivate={repo.private} />}
                />
                <StackedList.Field
                  title={
                    <>
                      Updated <em>{repo.timestamp}</em>
                    </>
                  }
                  description={<Stats stars={repo.stars} forks={repo.forks ?? 0} pulls={repo.pulls ?? 0} />}
                  right
                  label
                  secondary
                />
              </StackedList.Item>
            </LinkComponent>
          ))}
        </StackedList.Root>
      )}
    </>
  )
}
