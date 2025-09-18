import { BlameItem } from '../types/blame'
import { escapeSingleQuote, timeAgoFromISOTime } from './utils'

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
            content: '${escapeSingleQuote(timeAgoFromISOTime(blameItem?.commitInfo?.author?.when || ''))}';
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
            line-height: 17px;
            left: ${dateWidth + 10}px;
            top: -2px;
            box-shadow: var(--cn-shadow-comp-avatar-inner);
            font-size: var(--cn-font-size-0);
            font-weight: var(--cn-font-weight-default-normal-500);
            background-color: var(--cn-set-brand-secondary-bg);
            color: var(--cn-set-brand-secondary-text);
            font-family: var(--font-family);
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
