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
 * Deprecate the `rounded` variant on Tag and Text Buttons.
 *
 * Rounded Tag / Button are no longer allowed in new builds. The `iconOnly`
 * button (and any iconOnly variant) is exempt — a circular icon button is fine.
 * Existing usages will surface as errors and should be phased out over time.
 */
function getRoundedVariantRules() {
  const components = ['Tag', 'Button']

  return components.map(name => ({
    // Matches <Component rounded ...> that does NOT also set iconOnly.
    selector: `JSXOpeningElement[name.name='${name}']:has(JSXAttribute[name.name='rounded']):not(:has(JSXAttribute[name.name='iconOnly']))`,
    message: `Rounded ${name} is deprecated and not allowed in new builds. Use the default (non-rounded) ${name}. Rounded is only permitted on the iconOnly variant.`
  }))
}

module.exports = {
  classNameRules: getClassNameRules(),
  roundedVariantRules: getRoundedVariantRules()
}
