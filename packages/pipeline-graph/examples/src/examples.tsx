import { useEffect, useState } from 'react'

import Example1 from './example1'
import AnimationExample from './example2-animations'
import PerformanceExample from './example3-performance'
import SizeExample from './example4-size'
import { ContentNodeTypes } from './types/content-node-types'

import './examples.css'

import React from 'react'

import ContextExample from './example5-context'

type ExperimentalType = 'sharpLine' | 'sharpBorder' | 'skeleton'

const examplesArr = [
  {
    name: 'Demo',
    component: Example1
  },
  {
    name: 'Animations',
    component: AnimationExample
  },
  {
    name: 'Performance',
    component: PerformanceExample
  },
  {
    name: 'Size',
    component: SizeExample
  },
  {
    name: 'Context',
    component: ContextExample
  }
]

const stepTypesArr = [ContentNodeTypes.step, ContentNodeTypes.serial, ContentNodeTypes.parallel]

const experimentalArr: ExperimentalType[] = ['sharpLine', 'sharpBorder', 'skeleton']

function App() {
  const [example, setExample] = useState(examplesArr[0].name)
  const [addStepType, setAddStepType] = useState<ContentNodeTypes>(ContentNodeTypes.step)
  const [experimental, setExperimental] = useState({
    sharpLine: false,
    sharpBorder: false,
    skeleton: false
  })

  const render = () => {
    switch (example) {
      case 'Demo':
        return <Example1 addStepType={addStepType} />
      case 'Animations':
        return <AnimationExample />
      case 'Performance':
        return <PerformanceExample />
      case 'Size':
        return <SizeExample />
      case 'Context':
        return <ContextExample />
    }
  }

  useEffect(() => {
    const { body } = document
    experimental.sharpLine ? body.classList.add('sharp-line') : body.classList.remove('sharp-line')
    experimental.sharpBorder ? body.classList.add('sharp-border') : body.classList.remove('sharp-border')
    experimental.skeleton ? body.classList.add('skeleton') : body.classList.remove('skeleton')
  }, [experimental])

  return (
    <>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          rowGap: '5px'
        }}
      >
        <div style={{ display: 'flex', columnGap: '5px', height: '20px' }}>
          {examplesArr.map(exampleItem => (
            <button
              onClick={() => {
                setExample(exampleItem.name)
              }}
            >
              {exampleItem.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', columnGap: '5px', height: '20px' }}>
          {stepTypesArr.map(stepTypeItem => (
            <div>
              <input
                onChange={() => {
                  setAddStepType(stepTypeItem)
                }}
                type="radio"
                id={stepTypeItem}
                name={stepTypeItem}
                value={ContentNodeTypes.step}
                checked={addStepType === stepTypeItem}
              />
              <label htmlFor={stepTypeItem}>{stepTypeItem}</label>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', columnGap: '5px', height: '20px' }}>
          {experimentalArr.map(experimentalItem => (
            <div>
              <input
                id={experimentalItem}
                checked={experimental[experimentalItem]}
                type="checkbox"
                onChange={() => {
                  setExperimental({ ...experimental, [experimentalItem]: !experimental[experimentalItem] })
                }}
              />
              <label htmlFor={experimentalItem}>{experimentalItem}</label>
            </div>
          ))}
        </div>
      </div>
      {render()}
    </>
  )
}

export default App
