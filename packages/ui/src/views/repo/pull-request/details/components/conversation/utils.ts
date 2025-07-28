// https://github.com/component/textarea-caret-position

import { isEmpty } from 'lodash-es'

import { PrincipalsMentionMap } from '../../pull-request-details-types'

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
const properties = [
  'direction', // RTL support
  'boxSizing',
  'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY', // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
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
  'textDecoration', // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'
] as const

const isFirefox = typeof window !== 'undefined' && 'mozInnerScreenX' in window

export function getCaretPosition(element: HTMLTextAreaElement) {
  return {
    caretStartIndex: element.selectionStart || 0,
    caretEndIndex: element.selectionEnd || 0
  }
}

export function getCurrentWord(element: HTMLTextAreaElement) {
  const text = element.value
  const { caretStartIndex } = getCaretPosition(element)

  // Find the start position of the word
  let start = caretStartIndex
  while (start > 0 && text[start - 1].match(/\S/)) {
    start--
  }

  // Find the end position of the word
  let end = caretStartIndex
  while (end < text.length && text[end].match(/\S/)) {
    end++
  }

  const w = text.substring(start, end)

  return w
}

export function replaceWord(element: HTMLTextAreaElement, value: string) {
  const text = element.value
  const caretPos = element.selectionStart

  // Find the word that needs to be replaced
  const wordRegex = /[\w@#]+/g
  let match
  let startIndex
  let endIndex

  while ((match = wordRegex.exec(text)) !== null) {
    startIndex = match.index
    endIndex = startIndex + match[0].length

    if (caretPos >= startIndex && caretPos <= endIndex) {
      break
    }
  }

  // Replace the word with a new word using document.execCommand
  if (startIndex !== undefined && endIndex !== undefined) {
    // Preserve the current selection range
    const selectionStart = element.selectionStart
    const selectionEnd = element.selectionEnd

    // Modify the selected range to encompass the word to be replaced
    element.setSelectionRange(startIndex, endIndex)

    // REMINDER: Fastest way to include CMD + Z compatibility
    // Execute the command to replace the selected text with the new word
    document.execCommand('insertText', false, value)

    // Restore the original selection range
    element.setSelectionRange(
      selectionStart - (endIndex - startIndex) + value.length,
      selectionEnd - (endIndex - startIndex) + value.length
    )
  }
}

export function getCaretCoordinates(element: HTMLTextAreaElement, position: number) {
  // Clean up any existing mirror div
  const existingDiv = document.querySelector('#input-textarea-caret-position-mirror-div')
  if (existingDiv) {
    existingDiv.parentNode?.removeChild(existingDiv)
  }

  // The mirror div will replicate the textarea's style
  const div = document.createElement('div')
  div.id = 'input-textarea-caret-position-mirror-div'
  document.body.appendChild(div)

  const style: CSSStyleDeclaration = div.style
  const computed = window.getComputedStyle(element)
  const isInput = element.nodeName === 'INPUT'

  // Default textarea styles
  style.whiteSpace = 'pre-wrap'
  if (!isInput) style.wordWrap = 'break-word' // only for textarea-s

  // Position off-screen
  style.position = 'absolute' // required to return coordinates properly
  style.visibility = 'hidden' // not 'display: none' because we want rendering

  // Transfer the element's properties to the div
  properties.forEach(function (prop) {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
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
          style.lineHeight = 0 + 'px'
        }
      } else {
        style.lineHeight = computed.height
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      style[prop] = computed[prop]
    }
  })

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height)) style.overflowY = 'scroll'
  } else {
    style.overflow = 'hidden' // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position)
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput) div.textContent = div.textContent.replace(/\s/g, '\u00a0')

  const span = document.createElement('span')
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '' // || because a completely empty faux span doesn't render at all
  div.appendChild(span)

  const coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  }

  // Always clean up the mirror div
  document.body.removeChild(div)

  return coordinates
}

/**
 * ==================================
 * COMMENT AND USER MAPPING FUNCTIONS
 * ==================================
 */

export const replaceMentionIdWithEmail = (input: string, mentionsMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\d+)\]/g, (match, id) => (mentionsMap[id] ? `@[${mentionsMap[id].email}]` : match))

/**
 * Replaces all mentions of the form @[\S+@\S+\.\S+] with the id from the emailMap.
 * If the email is not found in the emailMap, the original mention is left unchanged.
 * @param input The string that contains the mentions to be replaced.
 * @param emailMap A map of email to TypesPrincipalInfo.
 * @returns A string with all mentions replaced with their corresponding id.
 */
export const replaceMentionEmailWithId = (input: string, emailMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\S+@\S+\.\S+)\]/g, (match, email) => (emailMap[email] ? `@[${emailMap[email].id}]` : match))

export const replaceMentionEmailWithDisplayName = (input: string, emailMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\S+@\S+\.\S+)\]/g, (match, email) =>
    emailMap[email] ? `[@${emailMap[email].display_name}](mailto:${emailMap[email].email})` : match
  )

export const replaceMentionIdWithDisplayName = (input: string, mentionsMap: PrincipalsMentionMap) =>
  input.replace(/@\[(\d+)\]/g, (match, id) => {
    try {
      const principal = mentionsMap?.[id]
      if (principal && principal.display_name && principal.email) {
        return `[@${principal.display_name}](mailto:${principal.email})`
      }
      return match
    } catch (error) {
      console.warn('Error accessing mentionsMap:', error)
      return match
    }
  })

/**
 * Transforms an object to use email property values as keys
 * @param {Object} data - The original object with numeric keys
 * @returns {Object} - New object with email addresses as keys
 */
export const replaceEmailAsKey = (data: PrincipalsMentionMap): PrincipalsMentionMap => {
  if (isEmpty(data)) return {}

  const result: PrincipalsMentionMap = {}

  // Iterate through each entry in the original object
  Object.values(data).forEach(user => {
    if (user.email) {
      // Use email as the new key, keeping all original properties
      result[user.email] = user
    }
  })

  return result
}
