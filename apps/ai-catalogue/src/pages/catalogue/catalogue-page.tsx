import { extractCatalogueEntries } from '@harnessio/ai-chat-core'
import { defaultPlugin } from '@harnessio/ai-chat-components'
import { useMemo, useState } from 'react'
import { ComponentCard } from './component-card'

const CATEGORIES = ['all', 'core', 'feedback', 'capability', 'custom'] as const

export function CataloguePage() {
  const entries = useMemo(() => extractCatalogueEntries(defaultPlugin), [])
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
    <div className="p-cn-xl">
      <div className="mb-cn-lg">
        <h2 className="text-cn-size-5 font-bold text-cn-1">Component Catalogue</h2>
        <p className="text-cn-size-2 text-cn-3 mt-cn-3xs">
          All available AI chat renderers. Hover over any component to inspect its backend event data.
        </p>
      </div>

      <div className="flex items-center gap-cn-md mb-cn-lg">
        <div className="flex items-center gap-cn-4xs bg-cn-2 rounded-cn-3 p-cn-4xs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-cn-sm py-cn-3xs text-cn-size-1 rounded-cn-2 transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-cn-1 text-cn-1 font-medium shadow-cn-1'
                  : 'text-cn-3 hover:text-cn-1'
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
          className="px-cn-sm py-cn-3xs text-cn-size-2 border border-cn-3 rounded-cn-3 bg-cn-1 text-cn-1 placeholder:text-cn-4 focus:outline-none focus:ring-1 focus:ring-cn-brand w-64"
        />
        <div className="ml-auto text-cn-size-1 text-cn-3">
          {filtered.length} component{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: 'var(--cn-layout-md)' }}>
        {filtered.map(entry => (
          <ComponentCard key={entry.type} entry={entry} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-cn-4xl text-cn-3">
          <p className="text-cn-size-2">No components match your filters.</p>
        </div>
      )}
    </div>
  )
}
