import caretXY from 'caret-xy'

interface Tokenizer {
  match?: string
  token?: string
  tokenIndex?: number
  tokenLen?: number
  word?: string
  wordLen?: number
}

export interface MentionsInfo {
  identifiersSet: RegExp
  trigger: string[]
  rule: string
  cached?: boolean
  data?: (done: (data) => void) => void
  match?: (element: HTMLElement) => boolean

  triggerSet?: Set<string>
  matchingRulesLeftRight?: string[]
  loadingHTML?: string
}

export interface Options {
  override?: boolean
  reuse?: boolean
}

// eslint-disable-next-line
interface KVO<T = any> {
  [key: string]: T
}

const EventType = {
  MouseUp: 'mouseup',
  MouseDown: 'mousedown',
  KeyDown: 'keydown',
  Input: 'input',
  FocusOut: 'focusout'
}

const mentionsRegistry: KVO<MentionsInfo> = {}
const body = document.body
const MATCH = '__match__'
const isFirefox = /firefox/i.test(navigator.userAgent) // Firefox has issue with 'insertText' command
const MENTIONS_TAG = 'x-mentions'
const attrSelected = 'aria-selected'
const mentionsList: HTMLElement = body.appendChild(document.createElement(MENTIONS_TAG))

const mentionsDefaults: MentionsInfo = {
  identifiersSet: /[A-Za-z0-9_.]/,
  trigger: ['$', '${'],
  rule: '${__match__}',
  data: done => done([]),
  loadingHTML: '<span loading>Loading...</span>'
}

function debug(...args) {
  if (localStorage.DEBUG_MENTIONS) {
    console.debug.apply(null, args)
  }
}

export function register(type: string, info: MentionsInfo, options: Options = {}) {
  if (type && type.length) {
    type.split(',').forEach(function(t) {
      t = t.trim()

      if (mentionsRegistry[t] && !options.override && !options.reuse) {
        return console.error('Mentions type [' + t + '] already registered. Unregister it first or passing options { override: true } or { reuse: true }')
      }

      if (!mentionsRegistry[t] || options.override) {
        const _info = Object.assign({}, info)

        _info.trigger = _info.trigger || mentionsDefaults.trigger
        _info.rule = _info.rule || mentionsDefaults.rule
        _info.cached = _info.cached || mentionsDefaults.cached
        _info.data = _info.data || mentionsDefaults.data

        _info.trigger = _info.trigger.sort(function(a, b) {
          return a.length > b.length ? -1 : 1
        })

        _info.triggerSet = new Set(_info.trigger.join(''))
        _info.matchingRulesLeftRight = _info.rule.split(MATCH)

        mentionsRegistry[t] = _info
      }
    })
  }
}

export function unregister(type: string) {
  delete mentionsRegistry[type]
}

export function setDefaults(customDefaults) {
  Object.assign(mentionsDefaults, customDefaults)
}

function getTokens(value, atIndex, trigger, triggerSet, rule, matchingRulesLeftRight): Tokenizer {
  const valueLen = value.length
  const triggerLen = trigger.length
  let tokenIndex = atIndex
  let tokenLen = 0
  let token,
    word,
    wordLen,
    match = ''

  while (tokenIndex--) {
    const ch = value[tokenIndex]

    // If char is out of identifier and trigger ranges, exit loop
    if (!triggerSet.has(ch) && !mentionsDefaults.identifiersSet.test(ch)) {
      break
    }

    const copiedStr = value.substr(tokenIndex, ++tokenLen)

    for (let i = 0; i < triggerLen; i++) {
      if (copiedStr.indexOf(trigger[i]) === 0) {
        token = copiedStr
        break
      }
    }

    if (token) {
      wordLen = tokenLen
      let index = tokenIndex + wordLen

      while (index < valueLen) {
        if (!mentionsDefaults.identifiersSet.test(value[index])) {
          if (
            matchingRulesLeftRight.length === 2 &&
            token.indexOf(matchingRulesLeftRight[0]) === 0 &&
            value.indexOf(matchingRulesLeftRight[1], index) === index
          ) {
            wordLen += matchingRulesLeftRight[1].length
          }
          break
        }
        wordLen++
        index++
      }

      word = value.substr(tokenIndex, wordLen)

      for (let i = 0; i < triggerLen; i++) {
        if (word.indexOf(trigger[i]) === 0) {
          match = token.substr(trigger[i].length)
          break
        }
      }

      break
    }
  }

  return token ? { match: match, token: token, tokenIndex: tokenIndex, tokenLen: tokenLen, word: word, wordLen: wordLen } : {}
}

function escapeHTML(unsafe) {
  return unsafe.replace(/[&<>"'/]/g, function(m) {
    switch (m) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case '\'':
        return '&#x27;'
      default:
        return '&#x2F;'
    }
  })
}

function escapeAndHighlightMatching(text, filterText) {
  if (filterText && text) {
    const index = text.toLowerCase().indexOf(filterText.toLowerCase())

    if (index !== -1) {
      return (
        escapeHTML(text.substring(0, index)) +
        '<mark>' +
        escapeHTML(text.substring(index, index + filterText.length)) +
        '</mark>' +
        escapeHTML(text.substring(index + filterText.length))
      )
    }
  }

  return escapeHTML(text)
}

let renderMatchesId

function renderMatches(match, mentionsInfo) {
  const id = renderMatchesId = +new Date()

  // Show loading...
  mentionsList.innerHTML = mentionsDefaults.loadingHTML || ''

  const done = function(data) {
    let filteredData = data
    match = match ? match.toLowerCase() : match

    if (id === renderMatchesId && filteredData && filteredData.length) {
      // data is an array of [{ name, value }] pair or array of string ['..', '..']
      if (typeof filteredData[0] === 'string') {
        filteredData = filteredData.map(function(element) {
          return { name: element, value: element }
        })
      }

      if (match) {
        filteredData = filteredData
          .filter(function(element) {
            return element.value.toLowerCase().indexOf(match) !== -1
          })
          .sort(function(a, b) {
            const aIndex = a.value.toLowerCase().indexOf(match)
            const bIndex = b.value.toLowerCase().indexOf(match)
            return aIndex > bIndex ? 1 : (aIndex === bIndex ? (a > b ? 1 : -1) : -1)
          })
      } else {
        filteredData = filteredData.sort(function(a, b) {
          return a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1
        })
      }

      const html = ['<ul>']
      filteredData.forEach((pair, index) => {
        const li =
          '<li ' +
          (!index ? attrSelected : '') +
          ' data-value="' +
          escapeHTML(pair.value) +
          '">' +
          escapeAndHighlightMatching(pair.name, match) +
          '</li>'

        html.push(li)
      })

      mentionsList.innerHTML = html.join('')

      if (mentionsInfo.cached) {
        mentionsInfo.cachedData = data
      }
    } else {
      hideSuggestions()
    }
  }

  if (!mentionsInfo.cachedData) {
    mentionsInfo.data(done)
  } else {
    done(mentionsInfo.cachedData)
  }
}

function showSuggestions(
  mentionsType,
  mentionsInfo,
  key,
  target,
  match,
  token,
  tokenIndex,
  tokenLen,
  word,
  wordLen,
  caretIndex,
  caretCoordinates
) {
  if (body.lastChild !== mentionsList) {
    body.appendChild(mentionsList) // move to the bottom to make sure no problem with z-index
  }

  if (target.activeMatch !== match) {
    target.activeMatch = match
    renderMatches(match, mentionsInfo)
  } else if (!mentionsInfo.cachedData || !mentionsInfo.cachedData.length) {
    return hideSuggestions()
  }

  mentionsList.style.display = 'inline'
  mentionsList.scrollTop = 0;

  (mentionsList as KVO).activeTargetInfo = {
    mentionsType,
    mentionsInfo,
    key: key,
    target: target,
    match: match,
    token: token,
    tokenIndex: tokenIndex,
    tokenLen: tokenLen,
    word: word,
    wordLen: wordLen,
    caretIndex: caretIndex,
    caretCoordinates: caretCoordinates
  }

  const caret = caretXY(target)
  const targetRect = target.getBoundingClientRect()
  const listRect = mentionsList.getBoundingClientRect()
  const left = caret.left + listRect.width <= targetRect.right ? caret.left : targetRect.right - listRect.width

  mentionsList.style.top = caret.top + caret.height + 'px'
  mentionsList.style.left = left + 'px'

  let selectedItem = mentionsList.querySelector(`[${attrSelected}]`)

  if (selectedItem) {
    selectedItem.removeAttribute(attrSelected)
  }

  selectedItem = mentionsList.firstElementChild?.firstElementChild as Element
  
  if (selectedItem) {
    selectedItem.setAttribute(attrSelected, '')
  }

  // eslint-disable-next-line
  // @ts-ignore
  debug('mentions:', { key, match, token, tokenIndex, tokenLen, word, wordLen })
}

function hideSuggestions() {
  mentionsList.style.display = 'none'
}

let selectingValue

function selectValue(e, value) {
  const targetInfo = (mentionsList as KVO).activeTargetInfo
  const target = targetInfo.target
  const targetValue = targetInfo.target.value
  const replacement = targetInfo.mentionsInfo.rule.replace(MATCH, value)

  // eslint-disable-next-line
  // @ts-ignore
  debug('mentions: Select value:', value, targetInfo)

  selectingValue = true // prevent `input` event during setting new value
  hideSuggestions()

  // Firefox does not support 'insertText' (https://bugzilla.mozilla.org/show_bug.cgi?id=1220696)
  // Firefox will not have a clean undo/redo history like other browsers
  if (isFirefox) {
    const newValue =
      targetValue.substr(0, targetInfo.tokenIndex) + replacement + targetValue.substr(targetInfo.tokenIndex + targetInfo.wordLen)
    const newCaretPos = targetInfo.tokenIndex + replacement.length
    target.value = newValue

    target.focus()
    target.setSelectionRange(newCaretPos, newCaretPos)
  } else {
    target.focus()
    target.setSelectionRange(targetInfo.tokenIndex, targetInfo.tokenIndex + targetInfo.wordLen)
    document.execCommand('insertText', false, replacement)
  }

  selectingValue = false
}

function hasParentWithNodeName(element, parentNodeName) {
  const parentNode = element.parentNode

  return parentNode
    ? parentNode.nodeName.toLowerCase() === parentNodeName ? true : hasParentWithNodeName(parentNode, parentNodeName)
    : false
}

/**
 * Get selected value from suggestion list.
 * @param {HTMLElement} node - Target node.
 * @returns {string} Value extracted from li[data-value].
 */
function getSelectedValue(node) {
  if (node && node.nodeName && node.nodeName.toLowerCase() !== 'li') {
    return getSelectedValue(node.parentElement)
  }

  return node && node.dataset && node.dataset.value
}

function registerElementIfMatching(element: HTMLElement) {
  for (const type in mentionsRegistry) {
    const info = mentionsRegistry[type]

    if (info.match && info.match(element)) {
      element.setAttribute('data-mentions', type)
      element.setAttribute('autocomplete', 'off')
      return true
    }
  }
}

function handler(e) {
  const target = e.target
  const nodeName = target.nodeName.toLowerCase()
  // const eventType = e.type && e.type.toLowerCase()
  const key = e.key

  if (nodeName === 'input' || nodeName === 'textarea') {
    const mentionsType = target.dataset.mentions

    if (!mentionsType || !mentionsType.length || !mentionsRegistry[mentionsType]) {
      if (target.hasAttribute('data-mentions')) {
        if (!mentionsRegistry[mentionsType]) {
          console.warn('Mentions: type [' + mentionsType + '] is not registered.')
        }
      } else {
        if (registerElementIfMatching(target)) {
          return handler(e)
        }
      }

      return
    }

    if (!target.mentionsInfo) {
      target.mentionsInfo = mentionsRegistry[mentionsType]
      if (target.getAttribute('autocomplete') !== 'off') {
        target.setAttribute('autocomplete', 'off')
      }
    }

    const mentionsInfo = target.mentionsInfo
    const selectionStart = target.selectionStart
    const selectionEnd = target.selectionEnd

    if (selectionStart !== selectionEnd) {
      return hideSuggestions()
    }

    const { match, token, tokenIndex, tokenLen, word, wordLen } = getTokens(
      target.value,
      selectionStart,
      mentionsInfo.trigger,
      mentionsInfo.triggerSet,
      mentionsInfo.rule,
      mentionsInfo.matchingRulesLeftRight
    )

    // eslint-disable-next-line
    // @ts-ignore
    debug('mentions:', { value: target.value, match, token, tokenIndex, tokenLen, word, wordLen })

    if (token) {
      return showSuggestions(
        mentionsType,
        mentionsInfo,
        key,
        target,
        match,
        token,
        tokenIndex,
        tokenLen,
        word,
        wordLen,
        selectionStart,
        caretXY(target)
      )
    } else {
      return hideSuggestions()
    }
  }
}

function preventDefault(e) {
  e.stopPropagation()
  e.preventDefault()
  return false
}

function isNodeHiddenInsideParent(node, parent) {
  const childRect = node.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return !(childRect.top >= parentRect.top && childRect.bottom <= parentRect.bottom)
}

function scrollToElement(element, parent, direction) {
  const elementRect = element.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  if (direction === 'down') {
    parent.scrollTop = parent.scrollTop + elementRect.top - parentRect.top
  } else {
    parent.scrollTop -= parentRect.height - elementRect.height
  }
}

const scheduler = e => {
  const target = e.target
  const eventType = e.type && e.type.toLowerCase()
  const nodeName = target.nodeName && target.nodeName.toLowerCase()
  const key = e.key
  const isShown = mentionsList.style.display !== 'none'

  // eslint-disable-next-line
  // @ts-ignore
  debug('mentions scheduler:', { eventType, key, isShown, e })

  // Click on an item in suggestion list: select the item value
  if (eventType === EventType.MouseDown) {
    if (isShown) {
      if (hasParentWithNodeName(target, MENTIONS_TAG)) {
        selectValue(e, getSelectedValue(target))
        return preventDefault(e)
      }

      if (!((nodeName === 'input' || nodeName === 'textarea') && target.dataset.mentions)) {
        return hideSuggestions()
      }
    }

    return // no more processing for mousedown event
  }

  if (eventType === EventType.KeyDown) {
    if (isShown) {
      const selectedItem = mentionsList.querySelector(`[${attrSelected}]`) as Element

      switch (key) {
        case 'ArrowDown':
          selectedItem.removeAttribute(attrSelected)

          if (selectedItem.nextElementSibling) {
            selectedItem.nextElementSibling.setAttribute(attrSelected, '')

            if (isNodeHiddenInsideParent(selectedItem.nextElementSibling, mentionsList)) {
              scrollToElement(selectedItem.nextElementSibling, mentionsList, 'down')
            }
          } else {
            mentionsList.firstElementChild?.firstElementChild?.setAttribute(attrSelected, '')
            mentionsList.scrollTop = 0
          }
          return preventDefault(e)

        case 'ArrowUp':
          selectedItem.removeAttribute(attrSelected)

          if (selectedItem.previousElementSibling) {
            selectedItem.previousElementSibling.setAttribute(attrSelected, '')
            if (isNodeHiddenInsideParent(selectedItem.previousElementSibling, mentionsList)) {
              scrollToElement(selectedItem.previousElementSibling, mentionsList, 'up')
            }
          } else {
            const element = mentionsList.firstElementChild?.lastElementChild as Element

            element.setAttribute(attrSelected, '')
            scrollToElement(element, mentionsList, 'down')
          }
          return preventDefault(e)

        case 'Enter':
        case 'Tab':
          selectValue(e, getSelectedValue(selectedItem))
          return preventDefault(e)

        case 'Escape':
          hideSuggestions()
          return preventDefault(e)
      }
    }

    switch (key) {
      case 'Shift':
      case 'Meta':
      case 'Control':
        return

      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        return setTimeout(() => handler(e), 20)
    }
  } else if (eventType !== EventType.Input) {
    return setTimeout(() => handler(e), 20)
  } else if (!selectingValue) {
    handler(e)
  } else {
    // eslint-disable-next-line
    // @ts-ignore
    debug('mentions: Ignore event', { eventType, key, isShown, e })
  }
}

document.addEventListener(EventType.KeyDown, scheduler)
document.addEventListener(EventType.Input, scheduler)
document.addEventListener(EventType.MouseUp, scheduler)
document.addEventListener(EventType.MouseDown, scheduler)
document.addEventListener(EventType.FocusOut, () => {
  const isShown = mentionsList.style.display !== 'none'

  if (isShown) {
    hideSuggestions()
  }
})