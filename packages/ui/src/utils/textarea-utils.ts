/**
 * Textarea utilities for caret position tracking and word manipulation.
 * Based on https://github.com/component/textarea-caret-position
 */

// CSS properties to copy to mirror div for accurate caret positioning
const MIRROR_PROPERTIES = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'MozTabSize'
] as const

const isFirefox = typeof window !== 'undefined' && 'mozInnerScreenX' in window

/**
 * Gets the current selection/caret position in a textarea
 */
export function getCaretPosition(element: HTMLTextAreaElement) {
  return {
    caretStartIndex: element.selectionStart || 0,
    caretEndIndex: element.selectionEnd || 0
  }
}

/**
 * Gets the word at the current caret position
 */
export function getCurrentWord(element: HTMLTextAreaElement) {
  const text = element.value
  const { caretStartIndex } = getCaretPosition(element)

  let start = caretStartIndex
  while (start > 0 && text[start - 1].match(/\S/)) {
    start--
  }

  let end = caretStartIndex
  while (end < text.length && text[end].match(/\S/)) {
    end++
  }

  return text.substring(start, end)
}

/**
 * Replaces the word at the current caret position with a new value.
 * Uses execCommand for undo/redo support.
 */
export function replaceWord(element: HTMLTextAreaElement, value: string) {
  const text = element.value
  const caretPos = element.selectionStart

  const wordRegex = /[\w@#]+/g
  let match
  let startIndex: number | undefined
  let endIndex: number | undefined

  while ((match = wordRegex.exec(text)) !== null) {
    startIndex = match.index
    endIndex = startIndex + match[0].length

    if (caretPos >= startIndex && caretPos <= endIndex) {
      break
    }
  }

  if (startIndex !== undefined && endIndex !== undefined) {
    const selectionStart = element.selectionStart
    const selectionEnd = element.selectionEnd

    element.setSelectionRange(startIndex, endIndex)
    document.execCommand('insertText', false, value)

    element.setSelectionRange(
      selectionStart - (endIndex - startIndex) + value.length,
      selectionEnd - (endIndex - startIndex) + value.length
    )
  }
}

export interface CaretCoordinates {
  top: number
  left: number
  height: number
}

/**
 * Gets the pixel coordinates of the caret in a textarea.
 * Creates a mirror div to measure the exact position.
 */
export function getCaretCoordinates(element: HTMLTextAreaElement, position: number): CaretCoordinates {
  // Clean up any existing mirror div
  const existingDiv = document.querySelector('#input-textarea-caret-position-mirror-div')
  if (existingDiv) {
    existingDiv.parentNode?.removeChild(existingDiv)
  }

  const div = document.createElement('div')
  div.id = 'input-textarea-caret-position-mirror-div'
  document.body.appendChild(div)

  const style: CSSStyleDeclaration = div.style
  const computed = window.getComputedStyle(element)
  const isInput = element.nodeName === 'INPUT'

  style.whiteSpace = 'pre-wrap'
  if (!isInput) style.wordWrap = 'break-word'

  style.position = 'absolute'
  style.visibility = 'hidden'

  MIRROR_PROPERTIES.forEach(function (prop) {
    if (isInput && prop === 'lineHeight') {
      if (computed.boxSizing === 'border-box') {
        const height = parseInt(computed.height)
        const outerHeight =
          parseInt(computed.paddingTop) +
          parseInt(computed.paddingBottom) +
          parseInt(computed.borderTopWidth) +
          parseInt(computed.borderBottomWidth)
        const targetHeight = outerHeight + parseInt(computed.lineHeight)
        if (height > targetHeight) {
          style.lineHeight = height - outerHeight + 'px'
        } else if (height === targetHeight) {
          style.lineHeight = computed.lineHeight
        } else {
          style.lineHeight = '0px'
        }
      } else {
        style.lineHeight = computed.height
      }
    } else {
      // @ts-expect-error - dynamic property access
      style[prop] = computed[prop]
    }
  })

  if (isFirefox) {
    if (element.scrollHeight > parseInt(computed.height)) style.overflowY = 'scroll'
  } else {
    style.overflow = 'hidden'
  }

  div.textContent = element.value.substring(0, position)
  if (isInput) div.textContent = div.textContent.replace(/\s/g, '\u00a0')

  const span = document.createElement('span')
  span.textContent = element.value.substring(position) || ''
  div.appendChild(span)

  const coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  }

  document.body.removeChild(div)

  return coordinates
}
