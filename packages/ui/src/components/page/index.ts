import { Page as PageBase } from './page'
import { HeaderV2 } from './page-header-v2'

export const Page = {
  ...PageBase,
  HeaderV2
}

export type { PageHeaderProps, PageHeaderBackProps, PageHeaderButtonProps } from './page'
export type { PageHeaderV2Props, HeaderV2TabItem } from './page-header-v2'