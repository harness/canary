# Harness Design System

This package provides the core design system for Harness UI components.

## Installation

```bash
pnpm add @harnessio/core-design-system
```

## Usage

### Importing CSS Styles

To import all design system styles:

```css
@import '@harnessio/core-design-system/core-styles';
@import '@harnessio/core-design-system/oss-themes';
@import '@harnessio/core-design-system/enterprise-themes';
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
pnpm build
```

## Development

- `dist/styles/` - Contains all CSS stylesheets
- `dist/styles-esm/` - Contains all JavaScript values for the design system
