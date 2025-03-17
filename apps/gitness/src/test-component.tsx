import { useMemo } from 'react'

import * as styles from '@harnessio/core-design-system/styles-esm'
import { Badge, Icon, Text, Tooltip } from '@harnessio/ui/components'

export default function TestComponent() {
  const colorPalette = useMemo(() => {
    const shades = Object.keys(styles.colors.colors.blue)

    return { shades }
  }, [])

  return (
    <div className="p-8 bg-black text-white max-w-[800px] mx-auto my-6 grid gap-10">
      <div>
        <Text as="h1" className="text-3xl font-bold mb-2">
          Badge
        </Text>
        <Text as="p" className="mb-10 text-gray-400">
          Different Badge variations
        </Text>

        <div className="space-x-2">
          <Badge>Default</Badge>
          <Badge variant="neutral">outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="danger">danger</Badge>
          <Badge variant="running">running</Badge>
          <Badge variant="merged">merged</Badge>
          <Badge variant="ai">ai</Badge>
        </div>

        <Text as="p" className="mt-10 mb-5 text-gray-400">
          Rounded full
        </Text>

        <div className="space-x-2">
          <Badge borderRadius="full">Default</Badge>
          <Badge borderRadius="full" variant="neutral">
            outline
          </Badge>
          <Badge borderRadius="full" variant="success">
            {/* <Icon size={10} name="tick" /> <span>Success</span> */}
            Success
          </Badge>
          <Badge borderRadius="full" variant="warning">
            warning
          </Badge>
          <Badge borderRadius="full" variant="danger">
            danger
          </Badge>
          <Badge borderRadius="full" variant="running">
            running
          </Badge>
          <Badge borderRadius="full" variant="merged">
            merged
          </Badge>
          <Badge borderRadius="full" variant="ai">
            ai
          </Badge>
        </div>

        <Text as="p" className="mt-10 mb-5 text-gray-400">
          Size sm
        </Text>

        <div className="space-x-2">
          <Badge size="sm">Default</Badge>
          <Badge size="sm" variant="neutral">
            outline
          </Badge>
          <Badge size="sm" variant="success">
            {/* <Icon size={10} name="tick" /> <span>Success</span> */}
            Success
          </Badge>
          <Badge size="sm" variant="warning">
            warning
          </Badge>
          <Badge size="sm" variant="danger">
            danger
          </Badge>
          <Badge size="sm" variant="running">
            running
          </Badge>
          <Badge size="sm" variant="merged">
            merged
          </Badge>
          <Badge size="sm" variant="ai">
            ai
          </Badge>
        </div>
      </div>

      <div style={{ backgroundColor: '#333' }} className="h-1" />

      <div>
        <Text as="h1" className="text-3xl font-bold my-2">
          Core color palette
        </Text>
        <Text as="p" className="mb-10 text-gray-400">
          The main color used to define the brand or highlight key elements.
        </Text>

        {/* Shades */}
        <div className="flex mb-4">
          <div className="w-24"></div> {/* Empty space for color name column */}
          {colorPalette.shades.map(shade => (
            <div key={shade} className="flex-1 text-center font-medium">
              {shade}
            </div>
          ))}
        </div>

        {/* Colors */}
        <div className="space-y-2">
          {Object.keys(styles.colors.colors).map(colorName => {
            const colorGroup = styles.colors.colors[colorName as keyof typeof styles.colors.colors]

            return (
              <div key={colorName} className="flex items-center">
                <div className="w-24 font-medium capitalize text-white">{colorName}</div>

                {colorPalette.shades.map(shade => {
                  const color = colorGroup[shade as keyof typeof colorGroup]
                  const colorValue = color?.$value || ''

                  return (
                    <div key={shade} className="flex-1 flex justify-center">
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div
                            className="size-14 rounded-md"
                            style={{
                              backgroundColor: colorValue,
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Content style={{ backgroundColor: 'black' }} side="top" align="center">
                          --{color?.name}: {colorValue}
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
