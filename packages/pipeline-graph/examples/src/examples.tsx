import { useEffect, useState } from 'react'

import Example1 from './example1'
import Example2 from './example2'
import Example3 from './example3'
import Example4 from './example4'
import Example5 from './example5'
import { ContentNodeTypes } from './types/content-node-types'

import './examples.css'

import React from 'react'

type ExperimentalType = 'sharpLine' | 'sharpBorder' | 'skeleton'

const examplesArr = [
  {
    name: 'example1',
    component: Example1
  },
  {
    name: 'example2',
    component: Example2
  },
  {
    name: 'example3',
    component: Example4
  },
  {
    name: 'example4',
    component: Example4
  },
  {
    name: 'example5',
    component: Example5
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
      case 'example1':
        return <Example1 addStepType={addStepType} />
      case 'example2':
        return <Example2 />
      case 'example3':
        return <Example3 />
      case 'example4':
        return <Example4 />
      case 'example5':
        return <Example5 />
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
              <label htmlFor="Step">{stepTypeItem}</label>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', columnGap: '5px', height: '20px' }}>
          {experimentalArr.map(experimentalItem => (
            <label>
              <input
                checked={experimental[experimentalItem]}
                type="checkbox"
                onChange={() => {
                  setExperimental({ ...experimental, [experimentalItem]: !experimental[experimentalItem] })
                }}
              ></input>
              {experimentalItem}
            </label>
          ))}
        </div>
      </div>
      {render()}
    </>
  )
}

export default App
