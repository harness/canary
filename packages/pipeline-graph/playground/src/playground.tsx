import React, { useEffect, useState } from 'react'

import Demo1 from './demo1'
import Demo2 from './demo2'
import Demo3Animation from './demo3-animations'
import Demo4Performance from './demo4-performance'
import Demo5Size from './demo5-size'

import './playground.css'

type ExperimentalType = 'sharpLine' | 'sharpBorder' | 'skeleton'

const demoArr = [
  {
    name: 'Minimal',
    component: Demo1
  },
  {
    name: 'All configuration',
    component: Demo2
  },
  {
    name: 'Animations',
    component: Demo3Animation
  },
  {
    name: 'Performance',
    component: Demo4Performance
  },
  {
    name: 'Size',
    component: Demo5Size
  }
]

const experimentalArr: ExperimentalType[] = ['sharpLine', 'sharpBorder', 'skeleton']

function Playground() {
  const [demo, setDemo] = useState(demoArr[0])
  const [experimental, setExperimental] = useState({
    sharpLine: false,
    sharpBorder: false,
    skeleton: false
  })

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
          rowGap: '5px',
          padding: '10px'
        }}
      >
        <div style={{ display: 'flex', columnGap: '5px', height: '20px' }}>
          {demoArr.map(demoItem => (
            <button
              style={{ ...(demoItem.name === demo.name ? { backgroundColor: 'yellow' } : {}) }}
              onClick={() => {
                setDemo(demoItem)
              }}
            >
              {demoItem.name}
            </button>
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

      <div
        style={{
          position: 'relative',
          left: '5vw',
          top: '10vh',
          height: '80vh',
          width: '90vw',
          overflow: 'hidden',
          border: '1px solid gray'
        }}
      >
        <demo.component />
      </div>
    </>
  )
}

export default Playground
