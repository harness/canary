import { useState } from 'react'
import { Button } from '@harnessio/canary'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ display: 'grid', minHeight: '90vh', placeItems: 'center' }}>
      <Button onClick={() => setCount(count => count + 1)}>THIS BUTTON IS FROM CANARY! count is {count}</Button>
    </div>
  )
}

export default App
