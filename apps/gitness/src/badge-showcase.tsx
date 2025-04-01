import { Badge } from '@harnessio/ui/components'

/**
 * This component showcases all the different badge variants and themes
 * for demonstration purposes.
 */
export const BadgeShowcase = () => {
  const variants = ['solid', 'soft', 'surface', 'status'] as const
  const themes = ['success', 'info', 'warning', 'destructive', 'primary', 'muted', 'merged', 'ai'] as const
  const sizes = ['default', 'sm'] as const

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Badge Variants and Conditional Properties</h1>

      {/* Section demonstrating conditional variant requirements */}
      <div className="space-y-8 mb-8">
        <div>
          <h2 className="text-lg font-medium mb-2">1. Theme &quot;ai&quot; (variant prop not allowed)</h2>
          <div className="flex flex-wrap gap-2">
            {/* For AI theme, variant should not be specified */}
            <Badge theme="ai">AI Theme</Badge>

            <Badge theme="ai">Passing</Badge>

            {/* The line below would cause a TypeScript error because variant is not allowed with theme="ai" */}
            {/* <Badge theme="ai" variant="solid">Invalid</Badge> */}
          </div>
        </div>
      </div>

      <hr />

      {/* Size and variant combinations */}
      {sizes.map(size => (
        <div key={size} className="space-y-6">
          <h2 className="text-lg font-medium capitalize">{size} Size</h2>
          {variants.map(variant => (
            <div key={variant} className="space-y-4">
              <h3 className="text-md font-medium capitalize">{variant} Variant</h3>
              <div className="flex flex-wrap gap-2">
                {themes
                  .filter(theme => {
                    // Skip combinations that would cause type errors:
                    // - Skip 'ai' theme when rendering variants, as it doesn't allow variant prop
                    return theme !== 'ai'
                  })
                  .map(theme => (
                    <Badge key={`${variant}-${theme}`} size={size} variant={variant} theme={theme}>
                      {theme}
                    </Badge>
                  ))}
              </div>
            </div>
          ))}
          <hr />
        </div>
      ))}

      {/* AI theme badges (without variant) */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">AI Theme (no variant)</h2>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <Badge key={`ai-${size}`} theme="ai" size={size}>
              AI {size}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">Usage Example</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm">
          {`// For non-AI themes, variant is required:
<Badge variant="solid" theme="success">success</Badge>
<Badge variant="soft" theme="destructive">destructive</Badge>
<Badge variant="surface" theme="info">info</Badge>

// For AI theme, variant is not allowed:
<Badge theme="ai">AI Theme</Badge>`}
        </pre>
      </div>
    </div>
  )
}

export default BadgeShowcase
