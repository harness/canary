// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=18046-91363
// source=packages/pipeline-graph/src/components/canvas/canvas.tsx
// component=Canvas

import figma from 'figma'

// Canvas is a pan/zoom viewport, not a themed component — the Figma "mode" variant (light/dark)
// is app-level theming applied by the consumer, not a Canvas prop. The pipeline content rendered
// inside is entirely consumer-supplied via the graph provider, so this shows the bare shell.
export default {
  example: figma.code`
    <Canvas>
      {/* pipeline nodes rendered via useGraphContext */}
    </Canvas>
  `,
  imports: ['import { Canvas } from "@harnessio/pipeline-graph"'],
  id: 'pipeline-canvas',
  metadata: {
    nestable: false
  }
}
