import React from 'react'

import { Badge } from '@packages/ui/src/components/badge/badge'

/**
 * This component showcases all the different badge variants and themes
 * for demonstration purposes.
 */
export const BadgeShowcase = () => {
  const variants = ['solid', 'surface', 'soft', 'outline']
  const themes = ['success', 'destructive', 'info', 'warning', 'muted']

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Badge Variants and Themes</h1>

      {variants.map(variant => (
        <div key={variant} className="space-y-2">
          <h2 className="text-lg font-medium capitalize">{variant} Variant</h2>
          <div className="flex flex-wrap gap-2">
            {themes.map(theme => (
              <Badge key={`${variant}-${theme}`} variant={variant as any} theme={theme as any}>
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">Usage Example</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm">
          {`<Badge variant="solid" theme="success">success</Badge>
<Badge variant="outline" theme="success">success</Badge>
<Badge variant="soft" theme="destructive">destructive</Badge>
<Badge variant="surface" theme="info">info</Badge>
<Badge variant="outline" theme="muted">muted</Badge>`}
        </pre>
      </div>
    </div>
  )
}

export default BadgeShowcase
