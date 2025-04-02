import { Badge, Icon } from '@harnessio/ui/components'

const getTimeZoneAbbreviation = () =>
  new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ').pop()

/**
 * This component showcases all the different badge variants and themes
 * for demonstration purposes.
 */
export const BadgeShowcase = () => {
  // Define valid variants and themes
  const regularVariants = ['solid', 'soft', 'surface', 'status'] as const
  const themes = ['success', 'info', 'warning', 'danger', 'primary', 'muted', 'merged', 'ai'] as const
  const sizes = ['default', 'sm'] as const

  // Section titles
  const SECTION_TITLES = {
    AI_THEME: '1. Theme "ai" (variant prop not allowed)',
    COUNTER_BADGES: '2. Counter Badges',
    DEFAULT_COUNTER: 'Default Counter',
    PRIMARY_COUNTER: 'Primary Counter'
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-4">Badge Variants and Conditional Properties</h1>

      <div className="space-x-4">
        <Badge className="leading-none" size="sm" variant="status" theme="warning" pulse>
          Running
        </Badge>
        <Badge className="gap-x-1" variant="surface" theme="merged">
          <Icon name="branch" size={14} />
          <span>Test</span>
        </Badge>
        <Badge variant="soft" size="sm" theme="primary">
          {getTimeZoneAbbreviation()}
        </Badge>
        <Badge variant="soft" size="sm" theme="success">
          {getTimeZoneAbbreviation()}
        </Badge>
      </div>
      {/* Section demonstrating conditional variant requirements */}
      <div className="space-y-8 mb-8">
        <div>
          <h2 className="mb-2 text-lg font-medium">{SECTION_TITLES.AI_THEME}</h2>
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
      <div>
        <h2 className="mb-2 mt-4 text-lg font-medium">{SECTION_TITLES.COUNTER_BADGES}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium">{SECTION_TITLES.DEFAULT_COUNTER}</h3>
            <div className="mt-2 flex flex-wrap gap-3">
              <Badge variant="counter">1</Badge>
              <Badge variant="counter">99</Badge>
              <Badge variant="counter">999+</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium">{SECTION_TITLES.PRIMARY_COUNTER}</h3>
            <div className="mt-2 flex flex-wrap gap-3">
              <Badge theme={themes[4]} variant="counter">
                1
              </Badge>
              <Badge theme={themes[4]} variant="counter">
                99
              </Badge>
              <Badge theme={themes[4]} variant="counter">
                999+
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Size and variant combinations */}
      {sizes.map(size => (
        <div key={size} className="space-y-6">
          <h2 className="text-lg font-medium capitalize">{size} Size</h2>
          {regularVariants.map(variant => (
            <div key={variant} className="space-y-4">
              <h3 className="text-md font-medium capitalize">{variant} Variant</h3>
              <div className="flex flex-wrap gap-3">
                {themes
                  .filter(theme => {
                    // Skip combinations that would cause type errors:
                    // - Skip 'ai' theme when rendering variants, as it doesn't allow variant prop
                    return theme !== 'ai'
                  })
                  .map(theme => {
                    // Use a more specific type for each combination
                    if (variant === 'status') {
                      // Status variant works with any theme except 'ai'
                      return (
                        <Badge key={`${variant}-${theme}`} size={size} variant="status" theme={theme}>
                          {theme}
                        </Badge>
                      )
                    } else {
                      // Other variants (solid, soft, surface) work with any theme except 'ai'
                      return (
                        <Badge key={`${variant}-${theme}`} size={size} variant={variant} theme={theme}>
                          {theme}
                        </Badge>
                      )
                    }
                  })}
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
<Badge variant="soft" theme="danger">danger</Badge>
<Badge variant="surface" theme="info">info</Badge>

// For AI theme, variant is not allowed:
<Badge theme="ai">AI Theme</Badge>`}
        </pre>
      </div>
    </div>
  )
}

export default BadgeShowcase
