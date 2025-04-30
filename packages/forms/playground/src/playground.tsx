import { useState } from 'react'

import './playground.css'
import './implementation/style.css'

import ConditionalExample from './examples/conditional-example/conditional-example'
import DebugExample from './examples/debug-example/debug-example'
import InputsExample from './examples/inputs-example/inputs-example'
import ListPerformanceExample from './examples/list-performance-example/list-performance-example'
import PerformanceExample from './examples/performance-example/performance-example'
import RuntimeExample from './examples/runtime-example/runtime-example'
import ValidationExample from './examples/validation-example/validation-example'

const demoArr = [
  {
    name: 'Runtime',
    component: RuntimeExample
  },
  {
    name: 'Debug',
    component: DebugExample
  },
  {
    name: 'Basic',
    component: InputsExample
  },
  {
    name: 'Validation',
    component: ValidationExample
  },
  {
    name: 'Conditional',
    component: ConditionalExample
  },
  {
    name: 'Performance',
    component: PerformanceExample
  },
  {
    name: 'List Performance',
    component: ListPerformanceExample
  }
]

function App() {
  const [demo, setDemo] = useState(demoArr[0])

  return (
    <>
      <div className="main-buttons-holder">
        {demoArr.map(demoItem => (
          <button
            key={demoItem.name}
            className={demoItem.name === demo.name ? 'active-button' : undefined}
            onClick={() => {
              setDemo(demoItem)
            }}
          >
            {demoItem.name}
          </button>
        ))}
      </div>
      <div className="demo-holder">
        <demo.component />
      </div>
    </>
  )
}

export default App
