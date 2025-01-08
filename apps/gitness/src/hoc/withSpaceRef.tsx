import React from 'react'

import { LandingPageView } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useGetSpaceURLParam } from '../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../i18n/stores/i18n-store'

export function withSpaceRef<T>(WrappedComponent: React.ComponentType<T>) {
  return function WithSpaceRefWrapper(props: T) {
    const space_ref = useGetSpaceURLParam()
    console.log('space_ref in hoc', space_ref)
    const { spaces } = useAppContext()

    if (!space_ref) {
      return <LandingPageView spaces={spaces} useTranslationStore={useTranslationStore} />
    }

    return <WrappedComponent {...props} space_ref={space_ref} />
  }
}
