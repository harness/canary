import MultiSort from './multi-sort'
import SimpleSort from './simple-sort'
import { Sort as SortRoot } from './sort'
import SortSelect from './sort-select'

export const Sort = {
  Root: SortRoot,
  Select: SortSelect,
  MultiSort: MultiSort,
  SimpleSort: SimpleSort
}

export * from './type'
