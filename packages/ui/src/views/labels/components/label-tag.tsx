import { FC } from 'react'

import { getScopeType, IconV2, Layout, scopeTypeToIconMap, Tag, TagProps } from '@/components'

import { ILabelType } from '../types'

type LabelTagProps = {
  scope?: ILabelType['scope']
  color: ILabelType['color']
  labelKey: ILabelType['key']
  labelValue?: string
  withIndicator?: boolean
  tagProps?: Partial<TagProps>
  className?: string
}

export const LabelTag: FC<LabelTagProps> = ({
  scope,
  color,
  labelKey,
  labelValue,
  withIndicator = false,
  tagProps,
  className
}) => (
  <Layout.Grid gap="xs" align="center" columns="auto auto" className={className}>
    <Tag
      icon={scope !== undefined ? scopeTypeToIconMap[getScopeType(scope)] : undefined}
      variant="secondary"
      size="md"
      theme={color}
      label={labelKey}
      value={labelValue ?? ''}
      className="grid grid-flow-col content-center"
      labelClassName="grid grid-flow-col content-center"
      valueClassName="grid grid-flow-col content-center"
      {...tagProps}
    />

    {withIndicator && <IconV2 size="xs" name="plus-circle" className="text-cn-foreground-3" role="presentation" />}
  </Layout.Grid>
)
