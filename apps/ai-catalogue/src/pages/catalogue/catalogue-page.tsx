import { extractCatalogueEntries } from '@harnessio/ai-chat-core'
import { useMemo, useState } from 'react'

import { cataloguePlugin } from '../../plugin/catalogue-plugin'
import { ComponentCard } from './component-card'

const CATEGORIES = ['all', 'core', 'feedback', 'capability', 'custom'] as const

export function CataloguePage() {
  const entries = useMemo(() => extractCatalogueEntries(cataloguePlugin), [])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return entries.filter(entry => {
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
      const matchesSearch =
        !searchQuery ||
        entry.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [entries, activeCategory, searchQuery])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-cn-foreground-1">Component Catalogue</h2>
        <p className="text-sm text-cn-foreground-3 mt-1">
          All available AI chat renderers. Hover over any component to inspect its backend event data.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1 bg-cn-background-2 rounded-lg p-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-cn-background-1 text-cn-foreground-1 font-medium shadow-sm'
                  : 'text-cn-foreground-3 hover:text-cn-foreground-1'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search components..."
          className="px-3 py-1.5 text-sm border border-cn-borders-3 rounded-lg bg-cn-background-1 text-cn-foreground-1 placeholder:text-cn-foreground-4 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
        />
        <div className="ml-auto text-xs text-cn-foreground-3">
          {filtered.length} component{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filtered.map(entry => (
          <ComponentCard key={entry.type} entry={entry} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-cn-foreground-3">
          <p className="text-sm">No components match your filters.</p>
        </div>
      )}
    </div>
  )
}
