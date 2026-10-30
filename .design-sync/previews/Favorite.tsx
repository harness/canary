import * as React from 'react'
import { Favorite, Layout, Text } from '@harnessio/ui'

export function Toggle() {
  const [fav, setFav] = React.useState(true)
  return (
    <div style={{ padding: 16 }}>
      <Layout.Horizontal gap="sm" align="center">
        <Favorite isFavorite={fav} onFavoriteToggle={setFav} />
        <Text>acme/web-app</Text>
      </Layout.Horizontal>
    </div>
  )
}

export function NotFavorite() {
  const [fav, setFav] = React.useState(false)
  return (
    <div style={{ padding: 16 }}>
      <Layout.Horizontal gap="sm" align="center">
        <Favorite isFavorite={fav} onFavoriteToggle={setFav} />
        <Text>acme/payments-service</Text>
      </Layout.Horizontal>
    </div>
  )
}
