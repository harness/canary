import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// import cx from 'classnames'
// import { getCodeString } from 'rehype-rewrite'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { isEmpty } from 'lodash-es'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSanitize from 'rehype-sanitize'
import rehypeVideo from 'rehype-video'

// import type { SuggestionBlock } from 'components/SuggestionBlock/SuggestionBlock'
// import { CodeSuggestionBlock } from './CodeSuggestionBlock'
// import css from './MarkdownViewer.module.scss'
import { INITIAL_ZOOM_LEVEL } from '../utils/utils'
import ImageCarousel from './image-carousel'

interface MarkdownViewerProps {
  source: string
  maxHeight?: string | number
  // TODO: add ai stuff at a later point for code suggestions
  //   suggestionBlock?: SuggestionBlock
  //   suggestionCheckSums?: string[]
}

/**
 * @deprecated
 */
export function MarkdownViewer({
  source,
  maxHeight
  //   suggestionBlock,
  //   suggestionCheckSums
}: MarkdownViewerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL)
  const [imgEvent, setImageEvent] = useState<string[]>([])
  const refRootHref = useMemo(() => document.getElementById('repository-ref-root')?.getAttribute('href'), [])
  const ref = useRef<HTMLDivElement>(null)

  const interceptClickEventOnViewerContainer = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const imgTags = ref?.current?.querySelector('.wmde-markdown')?.querySelectorAll('img')
      const { target } = event
      if (imgTags && !isEmpty(imgTags)) {
        const imageArray = Array.from(imgTags)
        const imageStringArray = imageArray.filter(object => object.src && !object.className).map(img => img.src)
        setImageEvent(imageStringArray)
      }

      if (target instanceof HTMLAnchorElement) {
        const href = target.getAttribute('href')

        // Intercept click event on internal links and navigate to pages to avoid full page reload
        if (href && !/^http(s)?:\/\//.test(href)) {
          try {
            const url = new URL(target.href)

            if (url.origin === window.location.origin) {
              event.stopPropagation()
              event.preventDefault()

              if (href.startsWith('#')) {
                document.getElementById(href.slice(1).toLowerCase())?.scrollIntoView()
              } else {
                navigate(url.pathname)
              }
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error: MarkdownViewer/interceptClickEventOnViewerContainer', e)
          }
        }
      } else if (target instanceof HTMLImageElement) {
        setIsOpen(true)
      }
    },
    [navigate]
  )
  return (
    <div
      role="button"
      tabIndex={0}
      // className="bg-foreground"
      // className={cx(css.main, className, { [css.withMaxHeight]: maxHeight && (maxHeight as number) > 0 })}
      onClick={interceptClickEventOnViewerContainer}
      style={{ maxHeight: maxHeight }}
      ref={ref}
    >
      <MarkdownPreview
        source={source}
        className="prose dark:prose-invert !bg-background !max-w-full"
        // warpperElement={{ 'data-color-mode': darkMode ? 'dark' : 'light' }}
        rehypeRewrite={(node, _index, parent) => {
          if ((node as unknown as HTMLDivElement).tagName === 'a') {
            if (parent && /^h(1|2|3|4|5|6)/.test((parent as unknown as HTMLDivElement).tagName)) {
              parent.children = parent.children.slice(1)
            }

            // Rewrite a.href to point to the correct location for relative links to files inside repository.
            // Relative links are defined as links that do not start with /, #, https:, http:, mailto:,
            // tel:, data:, javascript:, sms:, or http(s):
            if (refRootHref) {
              const { properties } = node as unknown as { properties: { href: string } }
              let href: string = properties.href

              if (
                href &&
                !href.startsWith('/') &&
                !href.startsWith('#') &&
                !href.startsWith('https:') &&
                !href.startsWith('http:') &&
                !href.startsWith('mailto:') &&
                !href.startsWith('tel:') &&
                !href.startsWith('data:') &&
                !href.startsWith('javascript:') &&
                !href.startsWith('sms:') &&
                !/^http(s)?:/.test(href)
              ) {
                try {
                  // Some relative links are prefixed by `./`, normalize them
                  if (href.startsWith('./')) {
                    href = properties.href = properties.href.replace('./', '')
                  }

                  // Test if the link is relative to the current page.
                  // If true, rewrite it to point to the correct location
                  if (new URL(window.location.href + '/' + href).origin === window.location.origin) {
                    const currentPath = window.location.href.split('~/')[1]
                    const replaceReadmeText = currentPath?.replace('README.md', '') ?? ''
                    const newUrl =
                      '/~/' + (currentPath && !currentPath.includes(href) ? replaceReadmeText + '/' : '') + href
                    properties.href = (refRootHref + newUrl.replace(/\/\//g, '/')).replace(/^\/ng\//, '/')
                  }
                } catch (_exception) {
                  console.warn(_exception)
                  // eslint-disable-line no-empty
                }
              }
            }
          }
        }}
        rehypePlugins={[
          [rehypeSanitize],
          [rehypeVideo, { test: /\/(.*)(.mp4|.mov|.webm|.mkv|.flv)$/, details: null }],
          [rehypeExternalLinks, { rel: ['nofollow noreferrer noopener'], target: '_blank' }]
        ]}
        // components={{
        //   // Rewriting the code component to support code suggestions
        //   code: ({ children = [], className: _className, ...props }) => {
        //     const code = props.node && props.node.children ? getCodeString(props.node.children) : children

        //     if (
        //       typeof code === 'string' &&
        //       typeof _className === 'string' &&
        //       'language-suggestion' === _className.split(' ')[0].toLocaleLowerCase()
        //     ) {
        //       return (
        //         <CodeSuggestionBlock
        //           code={code}
        //           suggestionBlock={suggestionBlock}
        //           suggestionCheckSums={suggestionCheckSums}
        //         />
        //       )
        //     }

        //     return (
        //       <code onClick={Utils.stopEvent} className={String(_className)}>
        //         {children}
        //       </code>
        //     )
        //   }
        // }}
      />
      <ImageCarousel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setZoomLevel={setZoomLevel}
        zoomLevel={zoomLevel}
        imgEvent={imgEvent}
      />
    </div>
  )
}
