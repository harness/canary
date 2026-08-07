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

  // 18px (`text-cn-size-7` / `--cn-font-size-7`) is reserved for markdown
  // rendering and is not part of the UI type ramp. New UI usage must move to a
  // semantic heading role: heading-section (20px) or heading-base (16px).
  const restrictedSizeMessage =
    "'text-cn-size-7' (18px) is not part of the UI type ramp — it is reserved for markdown. Use 'font-heading-section' (20px) or 'font-heading-base' (16px) instead."

  const restrictedSizeRules = [
    {
      selector: `JSXAttribute[name.name='className'][value.value=/\\btext-cn-size-7\\b/]`,
      message: restrictedSizeMessage
    },
    {
      selector: `CallExpression[callee.name='cva'] > Literal[value=/\\btext-cn-size-7\\b/]`,
      message: restrictedSizeMessage
    },
    {
      selector: `CallExpression[callee.name='cn'] > Literal[value=/\\btext-cn-size-7\\b/]`,
      message: restrictedSizeMessage
    }
  ]

  // text-4 / foreground-4 is deprecated: text-3 and text-4 were combined into a
  // single disabled/placeholder color. text-3 is canonical; text-4 is a
  // temporary alias. New code must use text-3 / foreground-3.
  const deprecatedText4Message =
    "'foreground-4' / 'text-cn-4' is deprecated — text-3 and text-4 were combined. Use 'foreground-3' / 'text-cn-3' (the disabled / placeholder color) instead."

  const deprecatedText4Rules = [
    {
      selector: `JSXAttribute[name.name='className'][value.value=/\\btext-cn-4\\b/]`,
      message: deprecatedText4Message
    },
    {
      selector: `CallExpression[callee.name='cva'] > Literal[value=/\\btext-cn-4\\b/]`,
      message: deprecatedText4Message
    },
    {
      selector: `CallExpression[callee.name='cn'] > Literal[value=/\\btext-cn-4\\b/]`,
      message: deprecatedText4Message
    },
    {
      selector: `JSXAttribute[name.name='color'][value.value='foreground-4']`,
      message: deprecatedText4Message
    }
  ]

  return [...deprecatedCnRules, ...restrictedSizeRules, ...deprecatedText4Rules]
}

module.exports = {
  classNameRules: getClassNameRules()
}
