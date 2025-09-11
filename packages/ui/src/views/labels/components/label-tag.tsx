import { FC } from 'react'

import { getScopeType, IconV2, Layout, scopeTypeToIconMap, Tag, TagProps } from '@/components'

import { ILabelType } from '../types'

export type LabelTagProps = Omit<TagProps, 'label' | 'theme' | 'icon' | 'variant'> & {
  scope?: ILabelType['scope']
  color: ILabelType['color']
  labelKey?: ILabelType['key']
  withIndicator?: boolean
  wrapperClassName?: string
}

export const LabelTag: FC<LabelTagProps> = ({
  scope,
  color,
  labelKey,
  withIndicator = false,
  wrapperClassName,
  ...tagProps
}) => (
  <Layout.Grid gap="xs" align="center" columns="auto auto" className={wrapperClassName}>
    <Tag
      size="sm"
      icon={scope !== undefined ? scopeTypeToIconMap[getScopeType(scope)] : undefined}
      variant="secondary"
      theme={color}
      label={labelKey}
      className="grid grid-flow-col content-center"
      labelClassName="grid grid-flow-col content-center"
      valueClassName="grid grid-flow-col content-center"
      {...tagProps}
    />

    {withIndicator && <IconV2 size="xs" name="plus-circle" className="text-cn-3" role="presentation" />}
  </Layout.Grid>
)
