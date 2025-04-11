import { Button } from '@harnessio/ui/components'

export default function ButtonDisplay() {
  const variants = ['solid', 'soft', 'surface'] as const
  const themes = ['success', 'danger', 'muted', 'primary', 'ai'] as const
  const sizes = [null, 'sm', 'lg'] as const

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Button Variant Showcase</h1>

      {/* Special case for AI theme which doesn't allow variant prop */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI Theme (No Variant)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {sizes.map(size => (
            <Button key={`ai-${size || 'default'}`} theme="ai" {...(size !== null && { size })}>
              {size === null ? 'AI Button' : `AI ${size}`}
            </Button>
          ))}
        </div>
      </div>

      {/* All other theme and variant combinations */}
      {variants.map(variant => (
        <div key={variant} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{variant} Variant</h2>

          {/* Default theme (no theme prop) */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Default Theme</h3>
            <div className="flex flex-wrap gap-4 items-center">
              {sizes.map(size => (
                <Button
                  key={`default-${variant}-${size || 'default'}`}
                  variant={variant}
                  {...(size !== null && { size })}
                >
                  {size === null ? variant : `${variant} ${size}`}
                </Button>
              ))}
            </div>
          </div>

          {/* All other themes except AI */}
          {themes
            .filter(theme => theme !== 'ai')
            // Skip solid variant for success and danger themes
            .filter(theme => !(variant === 'solid' && (theme === 'success' || theme === 'danger')))
            .map(theme => (
              <div key={`${variant}-${theme}`} className="mb-6">
                <h3 className="text-lg font-medium mb-2 capitalize">{theme} Theme</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {sizes.map(size => (
                    <Button
                      key={`${theme}-${variant}-${size || 'default'}`}
                      variant={variant}
                      theme={theme}
                      {...(size !== null && { size })}
                    >
                      {size === null ? `${theme} ${variant}` : `${theme} ${variant} ${size}`}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          <hr />
        </div>
      ))}

      {/* Ghost variant (not in variants array but used in original code) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ghost Variant</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {sizes.map(size => (
            <Button key={`ghost-${size || 'default'}`} variant="ghost" {...(size !== null && { size })}>
              {size === null ? 'Ghost' : `Ghost ${size}`}
            </Button>
          ))}

          {themes
            .filter(theme => theme !== 'ai')
            .map(theme => (
              <Button key={`ghost-${theme}`} variant="ghost" theme={theme}>
                Ghost {theme}
              </Button>
            ))}
        </div>
      </div>

      {/* Rounded Button Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Rounded Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Default rounded button */}
          <Button rounded variant="solid">
            Rounded
          </Button>
          <Button rounded variant="soft">
            Rounded Soft
          </Button>
          <Button rounded variant="surface">
            Rounded Surface
          </Button>
          <Button rounded variant="ghost">
            Rounded Ghost
          </Button>

          {/* Rounded buttons with different themes - skip solid for success/danger */}
          <Button rounded variant="soft" theme="success">
            Success
          </Button>
          <Button rounded variant="soft" theme="danger">
            Danger
          </Button>
          <Button rounded variant="solid" theme="primary">
            Primary
          </Button>
          <Button rounded variant="solid" theme="muted">
            Muted
          </Button>

          {/* Rounded button with AI theme */}
          <Button rounded theme="ai">
            AI Rounded
          </Button>
        </div>
      </div>

      {/* Disabled Buttons Showcase */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Disabled Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Basic variants */}
          <Button disabled variant="solid">
            Disabled Solid
          </Button>
          <Button disabled variant="soft">
            Disabled Soft
          </Button>
          <Button disabled variant="surface">
            Disabled Surface
          </Button>
          <Button disabled variant="ghost">
            Disabled Ghost
          </Button>

          {/* With themes */}
          <Button disabled variant="soft" theme="primary">
            Disabled Primary
          </Button>
          <Button disabled variant="soft" theme="success">
            Disabled Success
          </Button>
          <Button disabled variant="soft" theme="danger">
            Disabled Danger
          </Button>

          <Button disabled variant="soft" size="sm" theme="danger">
            Disabled Danger sm
          </Button>

          {/* Rounded disabled buttons */}
          <Button disabled rounded variant="solid">
            Disabled Rounded
          </Button>

          {/* Disabled AI button */}
          <Button disabled theme="ai">
            Disabled AI
          </Button>
        </div>
      </div>
    </div>
  )
}
