# Harness Design System

This package provides the core design system for Harness UI components.

## Installation

```bash
npm install @harnessio/core-design-system
```

## Usage

### Importing CSS Styles

To import all design system styles:

```js
import '@harnessio/core-design-system/styles'
```

### Importing JavaScript Tokens

To import JavaScript tokens for programmatic usage:

```js
import { colors, spacing, typography } from '@harnessio/core-design-system/styles-esm'

// Example usage
console.log(colors.primary)
console.log(spacing.md)
```

Or import everything:

```js
import * as designTokens from '@harnessio/core-design-system/styles-esm'
```

### Importing Individual Components

You can also import the main package:

```js
import * as designSystem from '@harnessio/core-design-system'
```

## Building

To build the design system:

```bash
npm run build
```

This will:

1. Build the CSS styles (`npm run build:styles`)
2. Build the JavaScript ESM exports (`npm run build:styles:esm`)

## Development

- `src/styles/` - Contains all CSS stylesheets
- `src/styles-js/` - Contains all JavaScript values for the design system
