import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { vi } from 'vitest'
import { RepoList } from './repo-list'
import { RepositoryType } from '../repo.types'

const mockUseTranslationStore = () => ({
    t: (key: string, defaultValue: string) => defaultValue
})

const mockRepos: RepositoryType[] = [
    {
        id: 1,
        name: 'repo1',
        private: false,
        description: 'Description for repo1',
        stars: 10,
        pulls: 5,
        forks: 2,
        createdAt: 20220101,
        timestamp: '2023-01-01',
        importing: false
    },
    {
        id: 2,
        name: 'repo2',
        private: true,
        description: 'Description for repo2',
        stars: 20,
        pulls: 10,
        forks: 4,
        createdAt: 1641081600, // Epoch time for 2022-01-02
        timestamp: 1672617600, // Epoch time for 2023-01-02
        importing: true
    }
]

describe('RepoList', () => {
    it.skip('renders loading state', () => {
        render(
            <RepoList
                repos={[]}
                handleResetFiltersQueryAndPages={vi.fn()}
                isDirtyList={false}
                useTranslationStore={mockUseTranslationStore}
                isLoading={true}
                toRepository={vi.fn()}
                toCreateRepo={vi.fn()}
                toImportRepo={vi.fn()}
            />
        )
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders no data state when there are no repos and isDirtyList is false', () => {
        render(
            <RepoList
                repos={[]}
                handleResetFiltersQueryAndPages={vi.fn()}
                isDirtyList={false}
                useTranslationStore={mockUseTranslationStore}
                isLoading={false}
                toRepository={vi.fn()}
                toCreateRepo={vi.fn()}
                toImportRepo={vi.fn()}
            />
        )
        expect(screen.getByText('No repositories yet')).toBeInTheDocument()
    })

    it('renders no data state when there are no repos and isDirtyList is true', () => {
        render(
            <RepoList
                repos={[]}
                handleResetFiltersQueryAndPages={vi.fn()}
                isDirtyList={true}
                useTranslationStore={mockUseTranslationStore}
                isLoading={false}
                toRepository={vi.fn()}
                toCreateRepo={vi.fn()}
                toImportRepo={vi.fn()}
            />
        )
        expect(screen.getByText('No search results')).toBeInTheDocument()
    })

    it('renders list of repos', () => {
        render(
            <Router>
                <RepoList
                    repos={mockRepos}
                    handleResetFiltersQueryAndPages={vi.fn()}
                    isDirtyList={false}
                    useTranslationStore={mockUseTranslationStore}
                    isLoading={false}
                    toRepository={(repo) => `/repo/${repo.name}`}
                    toCreateRepo={vi.fn()}
                    toImportRepo={vi.fn()}
                />
            </Router>
        )
        expect(screen.getByText('repo1')).toBeInTheDocument()
        expect(screen.getByText('repo2')).toBeInTheDocument()
    })

    it('calls handleResetFiltersQueryAndPages when clear filters button is clicked', () => {
        const handleResetFiltersQueryAndPages = vi.fn()
        render(
            <RepoList
                repos={[]}
                handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
                isDirtyList={true}
                useTranslationStore={mockUseTranslationStore}
                isLoading={false}
                toRepository={vi.fn()}
                toCreateRepo={vi.fn()}
                toImportRepo={vi.fn()}
            />
        )
        fireEvent.click(screen.getByText('Clear filters'))
        expect(handleResetFiltersQueryAndPages).toHaveBeenCalled()
    })
})