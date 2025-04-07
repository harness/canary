/**
 * Rules to adopt new design system
 *
 * class list will be updated once the
 * relevant class is completed removed from
 * tailwind-design-system.ts
 *
 */
function getClassNameRules() {
  const classVariants = ['foreground', 'background', 'borders']
  return classVariants.flatMap(variant => [
    {
      selector: `JSXAttribute[name.name='className'][value.value=/(?<!cn)-${variant}-/]`,
      message: `Use of '-${variant}-' class is not allowed. Use '-cn-${variant}-' instead`
    },
    {
      selector: `CallExpression[callee.name='cva'] > Literal[value=/(?<!cn)-${variant}-/]`,
      message: `Use of '-${variant}-' class is not allowed. Use '-cn-${variant}-' instead`
    },
    {
      selector: `CallExpression[callee.name='cn'] > Literal[value=/(?<!cn)-${variant}-/]`,
      message: `Use of '-${variant}-' class is not allowed. Use '-cn-${variant}-' instead`
    }
  ])
}

module.exports = {
  classNameRules: getClassNameRules()
}
