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
 * Component contract rules: className patterns a component's contract forbids.
 * Source: packages/ui/src/components/<folder>/<folder>.guide.md
 */
function getContractClassNameRules() {
  const forbidden = [
    {
      component: 'StatusBadge',
      pattern: 'animate-',
      message:
        "SBD-007: don't add animate-* classes to StatusBadge. Use variant='status' with pulse; it cannot also take an icon."
    }
  ]

  return forbidden.flatMap(({ component, pattern, message }) => [
    {
      selector: `JSXOpeningElement[name.name='${component}'] > JSXAttribute[name.name='className'] Literal[value=/${pattern}/]`,
      message
    },
    {
      selector: `JSXOpeningElement[name.name='${component}'] > JSXAttribute[name.name='className'] TemplateElement[value.raw=/${pattern}/]`,
      message
    }
  ])
}

module.exports = {
  classNameRules: [...getClassNameRules(), ...getContractClassNameRules()]
}
