/**
 * ESLint (v8, eslintrc) config that turns the design-system rules into errors.
 *
 * Why this exists: the shipped Tailwind preset REPLACES the default colour, spacing,
 * radius, font-size and shadow scales. `bg-blue-500` and `p-4` therefore compile to
 * nothing. The page renders unstyled and no tool complains. These rules make that
 * failure loud.
 *
 * Usage in a consuming app's .eslintrc.js:
 *   module.exports = { root: true, extends: [require.resolve('./eslint/ds-prototyping.js')] }
 *
 * Requires: eslint, eslint-plugin-react, eslint-plugin-tailwindcss, @typescript-eslint/parser.
 * The Tailwind plugin finds the app's own tailwind.config.{js,ts} (which must use the
 * @harnessio/ui preset). Do not set a relative `config` path.
 */
const { classNameRules } = require('./rules.js')

const UTILITY_PREFIXES =
  'bg|text|border|border-[trblxy]|ring|ring-offset|fill|stroke|from|via|to|divide|outline|decoration|accent|caret|shadow|placeholder'

const DEFAULT_PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

// esquery regex literals cannot contain `/`, and have no flags. Keep patterns slash-free.
const HEX_COLOR = '^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$'
const COLOR_FUNCTION = '(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\\('
const PALETTE_CLASS = `(^|[\\s:!])(${UTILITY_PREFIXES})-(${DEFAULT_PALETTE})-[0-9]{2,3}([\\s\\x2f]|$)`
const BW_CLASS = `(^|[\\s:!])(${UTILITY_PREFIXES})-(white|black)([\\s\\x2f]|$)`

const COLOR_MESSAGE =
  'Hard-coded colour. Use a semantic token class (e.g. bg-cn-1, text-cn-1, border-cn-2) or a component `theme`/`variant`/`color` prop. See DESIGN.md and docs/system/color-system.md.'
const PALETTE_MESSAGE =
  'Default Tailwind palette class. The design-system preset removes the default palette, so this generates no CSS. Use a semantic token class (bg-cn-*, text-cn-*, border-cn-*) or a component prop.'

const STYLE_PROPS =
  'color|background|backgroundColor|borderColor|borderRadius|boxShadow|fill|stroke|outlineColor|fontFamily|fontSize|fontWeight|lineHeight|letterSpacing|padding|paddingTop|paddingRight|paddingBottom|paddingLeft|margin|marginTop|marginRight|marginBottom|marginLeft|gap|rowGap|columnGap'

const restrictedSyntax = [
  ...classNameRules,
  {
    selector: `Literal[value=/${HEX_COLOR}/]`,
    message: COLOR_MESSAGE
  },
  {
    selector: `Literal[value=/${COLOR_FUNCTION}/]`,
    message: COLOR_MESSAGE
  },
  {
    selector: `TemplateElement[value.raw=/${COLOR_FUNCTION}/]`,
    message: COLOR_MESSAGE
  },
  {
    selector: `Literal[value=/${PALETTE_CLASS}/]`,
    message: PALETTE_MESSAGE
  },
  {
    selector: `TemplateElement[value.raw=/${PALETTE_CLASS}/]`,
    message: PALETTE_MESSAGE
  },
  {
    selector: `Literal[value=/${BW_CLASS}/]`,
    message: PALETTE_MESSAGE
  },
  {
    selector: `TemplateElement[value.raw=/${BW_CLASS}/]`,
    message: PALETTE_MESSAGE
  },
  {
    selector: `JSXAttribute[name.name='style'] Property[key.name=/^(${STYLE_PROPS})$/]`,
    message:
      'Inline style for colour, type, spacing, radius or shadow. Use token classes or component props. `style` is for dynamic geometry only (transform, width from data).'
  }
]

const forbiddenElements = [
  { element: 'button', message: 'Use <Button> from @harnessio/ui/components.' },
  { element: 'input', message: 'Use <Input> (or SearchInput, Checkbox, Switch, Radio) from @harnessio/ui/components.' },
  { element: 'select', message: 'Use <Select> from @harnessio/ui/components.' },
  { element: 'textarea', message: 'Use <Textarea> from @harnessio/ui/components.' },
  { element: 'dialog', message: 'Use <Dialog> from @harnessio/ui/components.' },
  { element: 'table', message: 'Use <Table> from @harnessio/ui/components.' }
]

const restrictedImportPatterns = [
  {
    group: ['@radix-ui/*'],
    message: 'Do not import Radix directly. @harnessio/ui/components wraps it with the design-system styling.'
  },
  {
    group: ['@harnessio/ui/src/*', '@harnessio/ui/dist/*'],
    message: 'Import from @harnessio/ui/components only. Deep imports bypass the public API.'
  },
  {
    group: ['@mui/*', '@chakra-ui/*', '@headlessui/*', '@mantine/*', 'antd', 'react-bootstrap', 'lucide-react', 'react-icons', 'react-icons/*'],
    message: 'Use @harnessio/ui/components (IconV2 for icons). Other UI libraries are not part of the design system.'
  }
]

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react', 'tailwindcss'],
  settings: { react: { version: 'detect' } },
  rules: {
    'no-restricted-syntax': ['error', ...restrictedSyntax],
    'no-restricted-imports': ['error', { patterns: restrictedImportPatterns }],
    'react/forbid-elements': ['error', { forbid: forbiddenElements }],
    'tailwindcss/no-arbitrary-value': 'error',
    'tailwindcss/no-contradicting-classname': 'error',
    'tailwindcss/no-custom-classname': [
      'error',
      // Host-app classes from docs/system/app-setup.md: the border reset and theme classes.
      // Component classes such as `cn-button` are intentionally not whitelisted.
      { whitelist: ['cn-root', '(light|dark)(-[a-z]+)*'] }
    ]
  }
}
