import { SandboxLayout} from '@/views'
import {ListActions, Pagination, SearchBox, Spacer, Text} from "@/components";
import {useDebounceSearch} from "@/hooks";
import {ListTemplateProps, SearchProps} from "@/templates";
import {Fragment, ReactNode, useRef, useState} from "react";
import {FilterRefType} from "@harnessio/filters";

const getSearchProps = <T,>(props: ListTemplateProps<T>): SearchProps => {
    if (props.withSearch) {
        const { searchQuery, setSearchQuery, searchLabel } = props
        return {
            searchQuery,
            setSearchQuery,
            searchLabel
        }
    }

    return {
        searchQuery: '',
        setSearchQuery: () => {}
    }
}

export const ListTemplate = <T,>(props: ListTemplateProps<T>) => {
    const {
        title,
        description,
        useTranslationStore,
        withSearch,
        listActions,
        paginationProps,
        filterHandler: FilterHandler,
        onFilterChange
    } = props


    const {
        searchQuery,
        setSearchQuery,
        searchLabel
    } = getSearchProps<T>(props)

    const { t } = useTranslationStore()

    const filtersRef = useRef<FilterRefType<T> | null>(null)
    const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)

    const { search, handleSearchChange } = useDebounceSearch({
        handleChangeSearchValue: setSearchQuery,
        searchValue: searchQuery || ''
    })

    const isShowListActions = !!withSearch || !!listActions

    const onFilterSelectionChange = (filterValues: (keyof T)[]) => {
        setSelectedFiltersCnt(filterValues.length)
    }

    const onFilterValueChange = (filterValues: T) => {
        const _filterValues = Object.entries(filterValues).reduce(
            (acc: Record<string, T[keyof T]>, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value
                }
                return acc
            },
            {}
        )

        onFilterChange?.(_filterValues)
    }

    const FilterWrapper = FilterHandler
        ? (props: { children: ReactNode }) => (
            <FilterHandler
                ref={filtersRef}
                onFilterSelectionChange={onFilterSelectionChange}
                onChange={onFilterValueChange}
                view="dropdown"
            >
                {props.children}
            </FilterHandler>
        )
        : Fragment;

    return (
        <SandboxLayout.Main>
            <SandboxLayout.Content>
                <Spacer size={2} />
                <Text
                    className="leading-tight"
                    size={5}
                    as="h1"
                    weight="medium"
                >
                    {title}
                </Text>
                {!!description && (
                    <Text
                        className="leading-tight mt-3"
                        as="p"
                        color="secondary"
                    >
                        {description}
                    </Text>
                )}
                <Spacer size={6} />
                {isShowListActions && (
                    <>
                        <ListActions.Root>
                            <ListActions.Left>
                                {!!withSearch && (
                                    <SearchBox.Root
                                        width="full"
                                        className="max-w-80"
                                        value={search || ''}
                                        handleChange={handleSearchChange}
                                        placeholder={!!searchLabel ? searchLabel : t('views:repos.search', 'Search')}
                                    />
                                )}
                            </ListActions.Left>
                            <ListActions.Right>
                                {listActions}
                            </ListActions.Right>
                        </ListActions.Root>
                        <Spacer size={4.5} />
                    </>
                )}

                {!!paginationProps && <Pagination t={t} {...paginationProps} />}
            </SandboxLayout.Content>
        </SandboxLayout.Main>
    )
}
