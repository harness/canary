import * as React from 'react'
import { ImageCarousel } from '@harnessio/ui'

const svg = (c: string, t: string) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="${c}"/><text x="320" y="210" font-size="28" text-anchor="middle" fill="#fff" font-family="sans-serif">${t}</text></svg>`)

export function Open() {
  return (
    <ImageCarousel
      isOpen
      setIsOpen={() => {}}
      title="Pull request screenshots"
      imgEvent={[svg('#1f6feb', 'Before: build failing'), svg('#2da44e', 'After: build passing'), svg('#8250df', 'Deploy preview')]}
    />
  )
}
