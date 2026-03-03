# `@harnessio/filters` — Agent Guide

URL-driven filter state management for React. Keeps filter values in sync with the URL's query string and provides a composable, headless component API — consumers bring their own UI.

---

## Package Info

| Field | Value |
|-------|-------|
| Package name | `@harnessio/filters` |
| Version | `0.0.4` |
| License | Apache-2.0 |
| React peer dep | `>=17.0.0 <19.0.0` |
| Router peer dep | `react-router-dom >=5.0.0 <7.0.0` |
| Entry point | `dist/index.js` |

**Commands**

```bash
pnpm build         # Production build
pnpm build:watch   # Watch mode
```

---

## Directory Structure

```
src/
├── index.ts               # Public exports
├── types.ts               # Core types: FilterType, FilterConfig, FilterStatus, Parser, FilterRefType
├── Filters.tsx            # Root provider + context + FiltersWrapper + createFilters factory
├── Filter.tsx             # Individual filter field (render-prop, headless)
├── FiltersContent.tsx     # Scans children to auto-register filters; renders visible ones
├── FiltersDropdown.tsx    # Render-prop component for the "add filter" dropdown
├── parsers.ts             # Built-in Parser implementations
├── router-context.tsx     # RouterContext + RouterContextProvider (router abstraction)
├── useRouter.ts           # Internal hook: reads location, wraps navigate for URL updates
└── useSearchParams.ts     # Fallback hook using window.location + popstate (no router)
```

---

## Core Concepts

### FilterStatus

Every filter slot has one of three statuses:

| Status | Meaning |
|--------|---------|
| `HIDDEN` | Not shown; no URL param |
| `VISIBLE` | Shown but no value applied |
| `FILTER_APPLIED` | Has an active value; reflected in URL |

### FilterType

Internal state shape for each filter slot:

```typescript
interface FilterType<T = any> {
  value?: T        // parsed JS value
  query?: string   // serialized URL string
  state: FilterStatus
  persistInURL?: boolean
}
```

### Parser

Converts between URL query strings (always `string`) and typed JS values:

```typescript
interface Parser<T> {
  parse: (value: string) => T
  serialize: (value: T) => string
}
```

Built-in parsers exported from the package:

| Export | Type | URL format |
|--------|------|------------|
| `defaultStringParser` | `Parser<unknown>` | raw string |
| `booleanParser` | `Parser<boolean>` | `"true"` / `"false"` |
| `stringArrayParser` | `Parser<string[]>` | comma-separated: `"a,b,c"` |
| `booleanArrayParser` | `Parser<boolean[]>` | comma-separated booleans |
| `dateTimeParser` | `Parser<[Date, Date]>` | two Unix ms timestamps: `"1234,5678"` |

---

## Component API

### `createFilters<T>()` — recommended entry point

Returns a typed `Filters` component with attached static sub-components, bound to your filter shape `T`:

```typescript
type MyFilters = { search: string; status: string[]; active: boolean }

const Filters = createFilters<MyFilters>()

// Sub-components available:
// Filters.Content   — registers and renders visible filters
// Filters.Dropdown  — "add filter" button/menu
// Filters.Component — individual filter field
```

### `<Filters>` (root provider)

Manages all filter state. Accepts:

| Prop | Type | Description |
|------|------|-------------|
| `view` | `'row' \| 'dropdown'` | `'row'` forces `allFiltersSticky`; `'dropdown'` hides filters until added |
| `onChange` | `(filters: T) => void` | Called whenever any filter value changes |
| `onFilterSelectionChange` | `(keys: (keyof T)[]) => void` | Called when visible filter set changes |
| `allFiltersSticky` | `boolean` | All filters always visible; can't be removed |
| `savedFiltersConfig` | `{ savedFilterKey, getSavedFilters }` | Enables loading a named saved filter from URL |

Exposes imperative methods via `ref`:

```typescript
const ref = useRef<FilterRefType<MyFilters>>(null)
ref.current.getValues()          // returns current T values
ref.current.reset()              // reset all filters to defaults
ref.current.reset(['search'])    // reset specific filters
```

### `<Filters.Content>` / `<FiltersContent>`

Place `<Filter>` children inside here. On mount it scans children to register all filter keys and their configs (`defaultValue`, `parser`, `sticky`), then renders only the ones whose status is not `HIDDEN`.

### `<Filters.Component>` / `<Filter>`

Headless render-prop for a single filter field. Inject your own UI:

```tsx
<Filters.Component
  filterKey="status"
  parser={stringArrayParser}
  defaultValue={[]}
>
  {({ value, onChange, removeFilter }) => (
    <MultiSelect value={value} onChange={onChange} onClear={() => removeFilter()} />
  )}
</Filters.Component>
```

Props:

| Prop | Description |
|------|-------------|
| `filterKey` | Key in `T` this filter controls |
| `children` | Render prop: `({ value, onChange, removeFilter }) => ReactNode` |
| `parser` | How to serialize/deserialize the value for the URL |
| `defaultValue` | Value used when filter is reset |
| `sticky` | Filter always visible; cannot be removed by user |

### `<Filters.Dropdown>` / `<FiltersDropdown>`

Render-prop that receives the list of currently hidden filters and an `addFilter` callback:

```tsx
<Filters.Dropdown>
  {(addFilter, availableFilters, resetFilters) => (
    <DropdownMenu>
      {availableFilters.map(key => (
        <DropdownMenuItem key={key} onClick={() => addFilter(key)}>
          Add {key}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  )}
</Filters.Dropdown>
```

---

## Router Integration

The package abstracts routing through `RouterContextProvider`. Wrap your app (or the filters subtree) with it, passing in `location` and `navigate` from your router:

```tsx
// With react-router-dom v6
import { useLocation, useNavigate } from 'react-router-dom'
import { RouterContextProvider } from '@harnessio/filters'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <RouterContextProvider location={location} navigate={navigate}>
      {/* ... */}
    </RouterContextProvider>
  )
}
```

Without `RouterContextProvider`, the package falls back to `window.location` / `window.history` directly (via `useSearchParams.ts`), so it works in non-router contexts but won't react to programmatic navigation.

---

## Saved Filters

Load a pre-defined filter set by ID from a URL param:

```tsx
<Filters
  savedFiltersConfig={{
    savedFilterKey: 'savedFilter',        // URL param name that holds the saved filter ID
    getSavedFilters: async (id) => {      // Returns the filter values for that ID
      const saved = await api.getSavedFilter(id)
      return saved.filters               // Partial<T>
    }
  }}
>
```

When the URL contains `?savedFilter=myFilterId`, the package automatically calls `getSavedFilters` on mount and applies the result.

---

## URL Sync Behaviour

- On mount, `FiltersContent` reads existing URL params and applies them to matching filter keys.
- When a filter value changes, the URL is updated with `replace: true` (no new history entry).
- Non-filter URL params are preserved — the package only touches params that correspond to registered filter keys.
- `persistInURL: false` on a filter value skips writing that value to the URL.

---

## Minimal Usage Example

```tsx
import { createFilters, stringArrayParser, booleanParser, RouterContextProvider } from '@harnessio/filters'
import { useLocation, useNavigate } from 'react-router-dom'

type Filters = { search: string; active: boolean }
const Filters = createFilters<Filters>()
const ref = useRef<FilterRefType<Filters>>(null)

function MyPage() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <RouterContextProvider location={location} navigate={navigate}>
      <Filters ref={ref} onChange={console.log}>
        <Filters.Content>
          <Filters.Component filterKey="search">
            {({ value, onChange }) => <input value={value ?? ''} onChange={e => onChange(e.target.value)} />}
          </Filters.Component>
          <Filters.Component filterKey="active" parser={booleanParser}>
            {({ value, onChange }) => <Toggle checked={value} onChange={onChange} />}
          </Filters.Component>
        </Filters.Content>
        <Filters.Dropdown>
          {(addFilter, available) => available.map(k => <button key={k} onClick={() => addFilter(k)}>{k}</button>)}
        </Filters.Dropdown>
      </Filters>
    </RouterContextProvider>
  )
}
```

---

## Important Constraints

- **Headless** — no styling or UI is provided. All visual components come from the consumer.
- **React 17 compatible** — do not use React 18-only APIs.
- **ESM only** — `"type": "module"`, no CJS build.
- **`FilterStatus` is internal** — consumers should not need to set status directly; it is managed by the `Filters` provider.
