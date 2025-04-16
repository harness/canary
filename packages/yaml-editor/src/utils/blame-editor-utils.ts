import { BlameItem } from '../types/blame'
import { escapeSingleQuote } from './utils'

export function getMonacoEditorCss({
  instanceId,
  lineNumbersPosition
}: {
  instanceId: string
  lineNumbersPosition: 'left' | 'center'
}) {
  let css = ''

  // we move '.margin' element and update left/width of monaco editor
  if (lineNumbersPosition === 'center') {
    css += `
      .monaco-editor-${instanceId} .monaco-scrollable-element.editor-scrollable {
          width: 100% !important;
          left: 0px !important;
      }

      .monaco-editor-${instanceId} .view-lines, .view-zones {
          width: 100% !important;
      }
      
      .monaco-editor-${instanceId} .margin {
        z-index: 1000;
        background: transparent !important;
      }`
  }

  css += `
      .monaco-editor-${instanceId} .blame-editor-separator {
        right: 14px;
        pointer-events: none;
      }

      .monaco-editor-${instanceId} {
        outline: none !important;
      }
      
      .monaco-editor-${instanceId} .view-line .blame-editor-commit {
        display: inline-block;
        color: var(--cn-text-1);
      }`

  return css
}

export function getMonacoEditorCommitCss({
  instanceId,
  blameData,
  dateWidth,
  avatarSize
}: {
  instanceId: string
  blameData: BlameItem[]
  dateWidth: number
  avatarSize: number
}) {
  let css = ''
  blameData.forEach(blameItem => {
    const avatarUrl = blameItem?.commitInfo?.author?.avatarUrl
    const initials = blameItem?.commitInfo?.author?.initials

    const avatarBackgroundCss = avatarUrl ? `background: url('${blameItem?.commitInfo?.author?.avatarUrl}');` : ''

    for (let lineNo = blameItem.fromLineNumber; lineNo <= blameItem.toLineNumber; lineNo++) {
      if (lineNo === blameItem.fromLineNumber) {
        css += `
          .monaco-editor-${instanceId} .view-line .blame-editor-commit-${lineNo}:before {
            content: '${escapeSingleQuote(blameItem?.commitInfo?.author?.when || '')}';
            position: absolute;
            left: 10px;
            top: 0px;
            color: var(--cn-text-3);
          }

          .monaco-editor-${instanceId} .view-line .blame-editor-commit-${lineNo}:after {
            content: '${initials ?? ' '}';
            position: absolute;
            border-radius: 50%;
            padding: 4px;
            text-align: center;
            background: var(--cn-set-gray-soft-bg);
            line-height: 17px;
            left: ${dateWidth + 10}px;
            top: -4px;
            color: var(--cn-text-3);
            width: ${avatarSize}px;
            height: ${avatarSize}px;
            ${avatarBackgroundCss}
            background-size: 100% 100%;
          }`
      } else {
        css += `
          .monaco-editor-${instanceId} .view-line .blame-editor-commit-${lineNo}:before {
            content: ' ';
            left: 10px;
            top: 0px;
            color: gray;
          }`
      }
    }
  })

  return css
}

export function createCommitMessage(msg: string, commitMsgLength: number) {
  let ret = ''
  if (msg.length > commitMsgLength) {
    ret = msg.slice(0, commitMsgLength - 3) + '...'
  } else if (msg.length < commitMsgLength) {
    ret = msg + ' '.repeat(commitMsgLength - msg.length)
  } else {
    ret = msg
  }

  return ' '.repeat(25) + ret + ' '.repeat(10)
}
