import { TFunctionWithFallback } from '@/context'
import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import { Scope } from '@views/common'

import { ExtendedScope } from './types'

export const getFilterScopeOptions = ({
  t,
  scope: { accountId, orgIdentifier, projectIdentifier }
}: {
  t: TFunctionWithFallback
  scope: Scope
}): { options: ComboBoxOptions[]; defaultValue: ComboBoxOptions } => {
  if (accountId && orgIdentifier && projectIdentifier) return { options: [], defaultValue: { label: '', value: '' } }

  if (accountId && orgIdentifier) {
    return {
      options: [
        { label: t('views:scope.orgAndProject', 'Organizations and projects'), value: ExtendedScope.OrgProg },
        { label: t('views:scope.orgOnly', 'Organizations only'), value: ExtendedScope.Organization }
      ],
      defaultValue: { label: t('views:scope.orgOnly', 'Organizations only'), value: ExtendedScope.Organization }
    }
  }

  if (accountId) {
    return {
      options: [
        { label: t('views:scope.all', 'Account, organizations and projects'), value: ExtendedScope.All },
        { label: t('views:scope.accountOnly', 'Account only'), value: ExtendedScope.Account }
      ],
      defaultValue: { label: t('views:scope.accountOnly', 'Account only'), value: ExtendedScope.Account }
    }
  }

  return { options: [], defaultValue: { label: '', value: '' } }
}
