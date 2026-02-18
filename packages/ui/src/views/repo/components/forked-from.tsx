import { FC } from 'react'

import { Link, Text } from '@/components'
import { useTranslation } from '@/context'

import { RepositoryType } from '../repo.types'

interface ForkedFromProps {
  upstream: NonNullable<RepositoryType['upstream']>
  toUpstreamRepo?: (path: string, subPath?: string) => string
}

export const ForkedFrom: FC<ForkedFromProps> = ({ upstream, toUpstreamRepo }) => {
  const { t } = useTranslation()

  return (
    <Text variant="body-normal" color="foreground-3">
      {t('views:repos.forkedFrom', 'Forked from')}{' '}
      {toUpstreamRepo ? (
        <Link external href={toUpstreamRepo(upstream.path ?? '', 'summary')} onClick={e => e.stopPropagation()}>
          {upstream.identifier ?? ''}
        </Link>
      ) : (
        upstream.identifier
      )}
    </Text>
  )
}
