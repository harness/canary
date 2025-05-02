import MultiSort from './multi-sort'
import { Sort as SortRoot } from './sort'
import SortSelect from './sort-select'

const Sort = {
  Root: SortRoot,
  Select: SortSelect,
  MultiSort: MultiSort
}

export default Sort
export * from './type'
