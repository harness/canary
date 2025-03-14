import { useMemo } from 'react'

import * as styles from '@harnessio/core-design-system/styles-esm'
import { Badge, Text, Tooltip, TooltipContent, TooltipTrigger } from '@harnessio/ui/components'

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
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="danger">danger</Badge>
          <Badge variant="running">running</Badge>
          <Badge variant="merged">merged</Badge>
          <Badge variant="ai">ai</Badge>
          {/* <Badge variant="danger">Danger</Badge> */}
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="size-14 rounded-md"
                            style={{
                              backgroundColor: colorValue,
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'black' }} side="top" align="center">
                          --{color?.name}: {colorValue}
                        </TooltipContent>
                      </Tooltip>
                      {/* <div
                        className="size-14 rounded-md"
                        style={{
                          backgroundColor: colorValue,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        title={`--${color?.name}: ${colorValue}`}
                      /> */}
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
