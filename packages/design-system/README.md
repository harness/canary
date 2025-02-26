# Design System

This package contains design tokens in W3C format (JSON) and tools to convert them to CSS variables.

## Structure

- `primitives/`: Contains primitive design tokens like colors, typography, etc.
- `theme/`: Contains theme-specific tokens that reference primitives
- `components/`: Contains component-specific design tokens
- `breakpoint/`: Contains breakpoint definitions

## Usage

### Building CSS Variables

To convert the design tokens to CSS variables, run:

```bash
npm run build
```

This will generate CSS files in the `dist/css/` directory.

### Using the CSS Variables

After building, you can include the generated CSS in your application:

```html
<link rel="stylesheet" href="path/to/dist/css/variables.css">
```

Or import it in your CSS/SCSS:

```css
@import 'path/to/dist/css/variables.css';

.my-element {
  color: var(--colors-pure-white);
  background-color: var(--background-1);
}
```

## Customizing

To customize the build process, edit the `style-dictionary.config.js` file.

## Adding New Tokens

1. Add new token files in the appropriate directory
2. Run `npm run build` to regenerate the CSS files

## Token Format

Tokens follow the W3C Design Tokens format:

```json
{
  "colors": {
    "pure": {
      "white": {
        "$type": "color",
        "$value": "#ffffff"
      }
    }
  }
}
```

This will generate a CSS variable `--colors-pure-white: #ffffff;`.
