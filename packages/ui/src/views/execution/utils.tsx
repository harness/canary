import { ReactNode } from 'react'

import { File, Folder, type TreeViewElement } from '@/components'

import { ExecutionTreeProps } from './types'

interface RenderTreeElementProps {
  element: TreeViewElement
  handleClick: ExecutionTreeProps['onSelectNode']
  parentElement?: TreeViewElement | null
  level?: number
}

export const renderTree = (
  elements: TreeViewElement[],
  handleClick: ExecutionTreeProps['onSelectNode']
): React.ReactNode => {
  if (elements.length === 0) return []
  return elements.map(element => (
    <div key={element.id}>{renderTreeElement({ element, handleClick, parentElement: null })}</div>
  ))
}

const renderTreeFolder = ({ element: folderElement, handleClick, level = 0 }: RenderTreeElementProps): ReactNode => {
  return (
    <Folder
      element={folderElement.name}
      value={folderElement.id}
      status={folderElement.status}
      duration={folderElement.duration}
      level={level}
    >
      {folderElement.children?.map(childElement => (
        <div key={childElement.id} data-level={level}>
          {renderTreeElement({ parentElement: folderElement, element: childElement, handleClick, level: level + 1 })}
        </div>
      ))}
    </Folder>
  )
}

const renderTreeFile = ({
  element: fileElement,
  handleClick,
  parentElement,
  level = 0
}: RenderTreeElementProps): ReactNode => {
  return (
    <File
      value={fileElement.id}
      status={fileElement.status}
      duration={fileElement.duration}
      handleSelect={() => handleClick({ parentNode: parentElement, childNode: fileElement })}
      level={level}
    >
      <p data-level={level}>{fileElement.name}</p>
    </File>
  )
}

const renderTreeElement = ({
  element,
  handleClick,
  parentElement,
  level = 0
}: RenderTreeElementProps): React.ReactNode => {
  if (element.children && element.children.length > 0) {
    return renderTreeFolder({ element, handleClick, parentElement, level })
  }
  return renderTreeFile({ element, handleClick, parentElement, level })
}

export const getElementById = (elements: TreeViewElement[], id: string): TreeViewElement | null => {
  const findElementById = (elementList: TreeViewElement[], searchId: string): TreeViewElement | null => {
    for (const element of elementList) {
      if (element.id === searchId) {
        return element
      }
      if (element.children) {
        const result = findElementById(element.children, searchId)
        if (result) {
          return result
        }
      }
    }
    return null // Return null if the element is not found
  }

  return findElementById(elements, id)
}
