import * as React from 'react'
import { Carousel, Card } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 420, padding: '16px 56px' }}>
      <Carousel.Root>
        <Carousel.Content>
          {['Build and test', 'Security scan', 'Deploy to staging', 'Promote to production'].map(t => (
            <Carousel.Item key={t}>
              <Card.Root>
                <Card.Title>{t}</Card.Title>
                <Card.Content>Step in the checkout-service release pipeline.</Card.Content>
              </Card.Root>
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
      </Carousel.Root>
    </div>
  )
}
