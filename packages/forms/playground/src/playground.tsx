import { useState } from 'react'

import '@harnessio/ui/styles.css'

import { Layout, Tabs, Text, TooltipProvider } from '@harnessio/ui/components'

import ConditionalExample from './examples/conditional-example/conditional-example'
import DebugExample from './examples/debug-example/debug-example'
import DynamicExample from './examples/dynamic-example/dynamic-example'
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
    name: 'Dynamic',
    component: DynamicExample
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
    <TooltipProvider>
      <Layout.Vertical className="gap-cn-lg p-cn-xl h-screen">
        <Text variant="heading-base">Forms Framework Playground</Text>
        <Tabs.Root
          defaultValue={demoArr[0].name}
          value={demo.name}
          onValueChange={value => {
            const selectedDemo = demoArr.find(demoItem => demoItem.name === value)
            if (selectedDemo) {
              setDemo(selectedDemo)
            }
          }}
        >
          <Tabs.List>
            {demoArr.map(demoItem => (
              <Tabs.Trigger key={demoItem.name} value={demoItem.name}>
                {demoItem.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
        <demo.component />
      </Layout.Vertical>
    </TooltipProvider>
  )
}

export default App
