/**
 * Regression test for the "chat disabled" crash: hooks built on
 * useAssistantRuntimeContext()/useChatContext() must never throw when no
 * AssistantRuntimeProvider/ChatContextProvider is mounted (e.g. the host app
 * has the AI chat feature turned off behind a flag). See useCurrentThread,
 * useThreadList, useContentFocus, useQuickActionScope, useRegisterQuickActions,
 * and usePageContext, all of which rely on these context accessors.
 */

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AssistantRuntime } from '../../runtime/AssistantRuntime/AssistantRuntime'
import { useAssistantRuntimeContext } from './AssistantRuntimeProvider'
import { useChatContext } from './ChatContextProvider'

function ConsumesRuntimeWithoutProvider(): JSX.Element {
  const runtime = useAssistantRuntimeContext()
  const thread = runtime.threads.getMainThread()
  return createElement('span', null, thread.messages.length)
}

function ConsumesChatContextWithoutProvider(): JSX.Element {
  const { setContext, getContextData } = useChatContext()
  setContext('probe', { displayName: 'probe', data: {} })
  return createElement('span', null, JSON.stringify(getContextData()))
}

describe('ai-chat-core context defaults (no provider mounted)', () => {
  it('useAssistantRuntimeContext does not throw and returns a usable runtime', () => {
    expect(() => renderToStaticMarkup(createElement(ConsumesRuntimeWithoutProvider))).not.toThrow()
  })

  it('useChatContext does not throw and setContext/getContextData are safe no-ops', () => {
    expect(() => renderToStaticMarkup(createElement(ConsumesChatContextWithoutProvider))).not.toThrow()
  })

  it('the default runtime thread can send() without a real backend without throwing', async () => {
    let runtime: AssistantRuntime | undefined
    function Capture(): null {
      runtime = useAssistantRuntimeContext()
      return null
    }
    renderToStaticMarkup(createElement(Capture))

    await expect(runtime!.threads.getMainThread().send('hello')).resolves.toBeUndefined()
  })
})
