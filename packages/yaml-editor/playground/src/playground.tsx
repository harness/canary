import { useState } from 'react'

import './playground.css'

import { DemoShadowDomBlame } from './demo-shadowdom-blame/demo-shadowdom-blame'
import { DemoCodeEditorShadowDom } from './demo-shadowdom-codeeditor/demo-shadowdom-codeeditor'
import { DemoShadowDom } from './demo-shadowdom/demo-shadowdom'
import { Demo1 } from './demo1/demo1'
import { Demo2 } from './demo2/demo2'
import { Demo3 } from './demo3/demo3'

const demoArr = [
  {
    name: 'CodeEditor ShadowDom',
    component: DemoCodeEditorShadowDom
  },
  {
    name: 'CodeEditor',
    component: Demo3
  },
  {
    name: 'YamlEditor ShadowDom',
    component: DemoShadowDom
  },
  {
    name: 'YamlEditor',
    component: Demo1
  },
  {
    name: 'YamlEditor - Animation',
    component: Demo2
  },

  {
    name: 'BlameEditor ShadowDom',
    component: DemoShadowDomBlame
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
      <demo.component />
    </>
  )
}

export default App
