/**
 * Rules to adopt new design system
 *
 * class list will be updated once the
 * relevant class is completed removed from
 * tailwind-design-system.ts
 *
 */
function getClassNameRules() {
  // const classVariants = ['background']
  const deprecatedCnVariants = ['foreground', 'background']

  const deprecatedCnRules = deprecatedCnVariants.flatMap(variant => [
    {
      selector: `JSXAttribute[name.name='className'][value.value=/-cn-${variant}-/]`,
      message: `Use of '-cn-${variant}-' class is deprecated and not allowed. Use the variant directly now. Example: '${variant === 'background' ? 'bg-cn-1' : 'text-cn-1'}'`
    },
    {
      selector: `CallExpression[callee.name='cva'] > Literal[value=/-cn-${variant}-/]`,
      message: `Use of '-cn-${variant}-' class is deprecated and not allowed. Use the variant directly now. Example: '${variant === 'background' ? 'bg-cn-1' : 'text-cn-1'}'`
    },
    {
      selector: `CallExpression[callee.name='cn'] > Literal[value=/-cn-${variant}-/]`,
      message: `Use of '-cn-${variant}-' class is deprecated and not allowed. Use the variant directly now. Example: '${variant === 'background' ? 'bg-cn-1' : 'text-cn-1'}'`
    }
  ])

  return deprecatedCnRules
}

/**
 * Deprecated typography variants/utilities.
 *
 * The weight-normalization work migrated all consumers off the light-weight
 * typography variants, but the variants/tokens/utilities themselves are RETAINED
 * for backwards-compatibility (see the `@deprecated` notes in text.tsx, the
 * `deprecated` flag in tailwind-utils-config/utilities/typography.ts, and the
 * `DEPRECATED:` token descriptions in core-design-system). These rules flag any
 * NEW adoption so the deprecated surface doesn't grow — migrate to the
 * `-normal` / `-strong` siblings instead.
 */
function getDeprecatedTypographyRules() {
  // `<Text variant="…">` / `captionVariant="…"` prop values → replacement.
  const deprecatedVariants = {
    'caption-light': 'caption-normal'
  }
  const variantAttrs = ['variant', 'captionVariant']

  // `.font-*` utility class names → replacement.
  const deprecatedFontClasses = {
    'font-caption-light': 'font-caption-normal',
    'font-body-light': 'font-body-normal'
  }

  const rules = []

  for (const [value, replacement] of Object.entries(deprecatedVariants)) {
    const message = `The '${value}' typography variant is deprecated and retained for backwards-compatibility only. Use '${replacement}' instead.`
    for (const attr of variantAttrs) {
      // variant="caption-light"
      rules.push({
        selector: `JSXAttribute[name.name='${attr}'][value.value='${value}']`,
        message
      })
      // variant={'caption-light'}
      rules.push({
        selector: `JSXAttribute[name.name='${attr}'] JSXExpressionContainer > Literal[value='${value}']`,
        message
      })
    }
  }

  for (const [cls, replacement] of Object.entries(deprecatedFontClasses)) {
    const message = `The '${cls}' utility is deprecated and retained for backwards-compatibility only. Use '${replacement}' instead.`
    rules.push(
      {
        selector: `JSXAttribute[name.name='className'][value.value=/\\b${cls}\\b/]`,
        message
      },
      {
        selector: `CallExpression[callee.name='cva'] Literal[value=/\\b${cls}\\b/]`,
        message
      },
      {
        selector: `CallExpression[callee.name='cn'] Literal[value=/\\b${cls}\\b/]`,
        message
      }
    )
  }

  return rules
}

module.exports = {
  classNameRules: [...getClassNameRules(), ...getDeprecatedTypographyRules()]
}
