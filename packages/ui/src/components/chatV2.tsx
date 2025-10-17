import { useRef, useState } from 'react'

import { Button, IconV2, Layout, Text } from '@/components'

export const ChatV2 = () => {
  const [collapsed, setCollapsed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Optional: Scroll to top when expanding
  const handleToggle = () => {
    setCollapsed(isCollapsed => {
      const next = !isCollapsed
      if (!next && containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return next
    })
  }

  return (
    <div
      ref={containerRef}
      className="bg-cn-2 border-r p-cn-container h-full"
      style={{
        width: collapsed ? '80px' : '412px',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)'
      }}
    >
      {collapsed ? (
        <div className="flex h-full items-end justify-center">
          <Button variant="transparent" size="sm" iconOnly tooltipProps={{ content: 'Expand' }} onClick={handleToggle}>
            <IconV2 name="expand-sidebar" skipSize />
          </Button>
        </div>
      ) : (
        <Layout.Vertical className="h-full justify-between">
          <Text>Chat</Text>
          <Button
            variant="transparent"
            size="sm"
            iconOnly
            tooltipProps={{ content: 'Collapse' }}
            onClick={handleToggle}
          >
            <IconV2 name="collapse-sidebar" skipSize />
          </Button>
        </Layout.Vertical>
      )}
    </div>
  )
}
