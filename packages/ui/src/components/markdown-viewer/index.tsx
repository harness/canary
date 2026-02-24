import { CSSProperties, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CopyButton, IconV2, IconV2NamesType, Text } from '@/components'
import MarkdownPreview from '@uiw/react-markdown-preview'
import rehypeExternalLinks from 'rehype-external-links'
import { getCodeString, RehypeRewriteOptions } from 'rehype-rewrite'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeVideo from 'rehype-video'
import remarkBreaks from 'remark-breaks'

import './style.css'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { CodeSuggestionBlock, SuggestionBlock } from './CodeSuggestionBlock'

export const getIsMarkdown = (language?: string) => language === 'markdown'

const isHeadingElement = (tagName: string) => /^h(1|2|3|4|5|6)/.test(tagName)
const isRelativeLink = (href: string) =>
  href && !href.startsWith('/') && !href.startsWith('#') && !/^https?:|mailto:|tel:|data:|javascript:|sms:/.test(href)

type AlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution'

const alertConfig: Record<AlertType, { title: string; icon: string }> = {
  note: {
    title: 'Note',
    icon: 'info-circle-solid'
  },
  tip: {
    title: 'Tip',
    icon: 'light-bulb-circle-solid'
  },
  important: {
    title: 'Important',
    icon: 'warning-circle-solid'
  },
  warning: {
    title: 'Warning',
    icon: 'warning-triangle-solid'
  },
  caution: {
    title: 'Caution',
    icon: 'minus-circle-solid'
  }
}

const markdownViewerVariants = cva('', {
  variants: {
    variant: {
      default: '',
      sm: 'markdown-sm',
      xs: 'markdown-xs'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type MarkdownViewerProps = {
  source: string
  speed?: number
  maxHeight?: string | number
  withBorder?: boolean
  className?: string
  suggestionBlock?: SuggestionBlock
  suggestionCheckSum?: string
  markdownClassName?: string
  showLineNumbers?: boolean
  onCheckboxChange?: (source: string) => void
  suggestionTitle?: string
  suggestionFooter?: ReactNode
  isLoading?: boolean
  imageUrlTransform?: (src: string) => string
  /** Use muted text color (text-cn-3) for markdown content */
  muted?: boolean
} & VariantProps<typeof markdownViewerVariants>

const MarkdownViewerLocal = ({
  source,
  speed = 0,
  maxHeight,
  withBorder = false,
  className,
  suggestionBlock,
  markdownClassName,
  showLineNumbers = false,
  onCheckboxChange,
  suggestionTitle,
  suggestionFooter,
  isLoading = false,
  imageUrlTransform,
  variant = 'default',
  muted = false
}: MarkdownViewerProps) => {
  const { navigate } = useRouterContext()
  const refRootHref = useMemo(() => document.getElementById('repository-ref-root')?.getAttribute('href'), [])
  const ref = useRef<HTMLDivElement>(null)

  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Track checkbox indices and set to data-checkbox-index
  const checkboxCounter = useRef<number>(0)

  // Reset checkbox counter at the start of each render
  checkboxCounter.current = 0

  const filteredSource = useMemo(() => source.split('\n').filter(line => line !== '' && line !== '```'), [source])

  const styles: CSSProperties = maxHeight ? { maxHeight } : {}

  const rewriteRelativeLinks = useCallback(
    (href: string) => {
      try {
        if (href.startsWith('./')) {
          href = href.replace('./', '')
        }

        const fullUrl = new URL(window.location.href + '/' + href)
        if (fullUrl.origin === window.location.origin) {
          const currentPath = window.location.href.split('~/')[1] ?? ''
          const replaceReadmeText = currentPath.replace('README.md', '')
          const newUrl = '/~/' + (currentPath && !currentPath.includes(href) ? replaceReadmeText + '/' : '') + href

          return (refRootHref + newUrl.replace(/\/\//g, '/')).replace(/^\/ng\//, '/')
        }

        return href
      } catch (error) {
        console.warn('Error rewriting relative link:', error)
        return href
      }
    },
    [refRootHref]
  )

  /**
   * Rewrite links nodes
   */
  const rehypeRewrite: RehypeRewriteOptions['rewrite'] = useCallback(
    (node, _index, parent) => {
      if (node.type === 'element' && node?.tagName === 'a') {
        // Remove links from titles
        if (parent && parent.type === 'element' && isHeadingElement(parent.tagName)) {
          parent.children = parent.children.slice(1)
        }

        // TODO: I'm not sure under what circumstances the condition for having an ID repository-ref-root would be met; I don't know why this code was written.
        if (refRootHref) {
          // Rewriting relative links
          const { properties } = node as unknown as { properties: { href: string } }
          if (properties?.href && isRelativeLink(properties.href)) {
            properties.href = rewriteRelativeLinks(properties.href)
          }
        }
      }
    },
    [refRootHref, rewriteRelativeLinks]
  )

  const interceptClickEventOnViewerContainer = useCallback(
    (event: MouseEvent) => {
      const { target } = event

      // Handle image clicks - open in new tab
      if (target instanceof HTMLImageElement) {
        event.preventDefault()
        const imageSrc = target.getAttribute('src')
        if (imageSrc) {
          window.open(imageSrc, '_blank', 'noopener,noreferrer')
        }
        return
      }

      if (target instanceof HTMLAnchorElement) {
        const href = target.getAttribute('href')
        // Only intercept internal links, allow external protocols (mailto:, tel:, etc.) to work normally
        if (href && !/^(https?:\/\/|mailto:|tel:|data:|javascript:|sms:)/.test(href)) {
          event.preventDefault()
          if (href.startsWith('#')) {
            document.getElementById(href.slice(1))?.scrollIntoView()
          } else {
            const newUrl = new URL(target.href)
            navigate(newUrl.pathname)
          }
        }
      }
    },
    [navigate]
  )

  // Handle checkbox state changes
  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckboxChange) {
        const TODO_LIST_ITEM_CLASS = 'task-list-item'
        const targetIsListItem = (event.target as HTMLElement).classList.contains(TODO_LIST_ITEM_CLASS)
        const target = (event.target as HTMLElement)?.closest?.(`.${TODO_LIST_ITEM_CLASS}`)

        // Handle both DOM structures:
        // 1. Without blank lines: <li><input>...</li>
        // 2. With blank lines: <li><p><input>...</p></li>
        const firstChild = target?.firstElementChild
        const input =
          firstChild?.tagName === 'INPUT'
            ? (firstChild as HTMLInputElement)
            : (firstChild?.querySelector('input[type="checkbox"]') as HTMLInputElement)

        const checked = targetIsListItem ? !input?.checked : input?.checked
        const checkboxIndex = parseInt(event.target.getAttribute('data-checkbox-index') || '0', 10)
        let currentCheckboxIndex = 0
        const newContent = source
          .split('\n')
          .map(line => {
            if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
              currentCheckboxIndex++

              if (checkboxIndex === currentCheckboxIndex) {
                return checked ? line.replace('- [ ]', '- [x]') : line.replace('- [x]', '- [ ]')
              }
            }
            return line
          })
          .join('\n')
        onCheckboxChange(newContent)
      }
    },
    [onCheckboxChange, source]
  )

  const getIsSuggestion = useCallback(
    (code: string) => {
      const trimmedCode = code.trim()
      const codeLines = trimmedCode.split('\n')
      const codeIndex = filteredSource.findIndex(line => line.includes(codeLines[0] || ''))
      const isSuggestion = codeIndex !== -1 && filteredSource[codeIndex - 1]?.includes('suggestion')

      return { isSuggestion, codeLines }
    },
    [filteredSource]
  )

  useEffect(() => {
    const container = ref.current

    if (container) {
      container.addEventListener('click', interceptClickEventOnViewerContainer)

      return () => {
        container.removeEventListener('click', interceptClickEventOnViewerContainer)
      }
    }
  }, [interceptClickEventOnViewerContainer])

  useEffect(() => {
    if (speed && currentIndex < source.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + source[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, source, speed])

  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || [])],
    attributes: {
      ...(defaultSchema.attributes || {}),
      div: [...(defaultSchema.attributes?.div || []), 'className'],
      p: [...(defaultSchema.attributes?.p || []), 'className']
    }
  }

  return (
    // TODO: Replace px-[64px] with a proper spacing token when available
    <div className={cn({ 'rounded-b-cn-3 border-x border-b py-cn-xl px-[64px]': withBorder }, className)}>
      <div ref={ref} style={styles}>
        <MarkdownPreview
          source={speed ? displayedText : source}
          className={cn(
            'prose prose-invert',
            markdownViewerVariants({ variant }),
            { 'markdown-muted': muted },
            markdownClassName
          )}
          rehypeRewrite={rehypeRewrite}
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[
            [rehypeSanitize, sanitizeSchema],
            [rehypeVideo, { test: /\.(mp4|mov|webm|mkv|flv)$/, details: false }],
            [rehypeExternalLinks, { rel: ['nofollow noreferrer noopener'], target: '_blank' }]
          ]}
          components={{
            img: ({
              alt,
              src: originalSrc,
              ...props
            }: {
              alt?: string
              src?: string
              node?: any
              [key: string]: any
            }) => {
              // Process the image source to handle relative paths
              let src = originalSrc || ''

              // Handle relative image paths
              if (imageUrlTransform) {
                src = imageUrlTransform(src)
              }

              // XSS Protection: Sanitize props
              const safeProps = { ...props }
              delete safeProps.node
              delete safeProps.dangerouslySetInnerHTML
              delete safeProps.onLoad
              delete safeProps.onError

              // Remove string-based event handlers
              const eventHandlerProps = Object.keys(safeProps).filter(
                prop => prop.startsWith('on') && typeof safeProps[prop] === 'string'
              )
              eventHandlerProps.forEach(prop => delete safeProps[prop])

              // Sanitize alt text
              const altText = typeof alt === 'string' ? alt.replace(/[<>]/g, '') : ''

              return <img src={src} alt={altText} {...safeProps} />
            },
            input: ({ type, checked, ...props }) => {
              // checkbox inputs
              if (type === 'checkbox') {
                checkboxCounter.current++
                return (
                  <input
                    type="checkbox"
                    defaultChecked={checked}
                    {...props}
                    data-checkbox-index={checkboxCounter.current}
                    onChange={handleCheckboxChange}
                    disabled={isLoading}
                  />
                )
              }
              return <input type={type} checked={checked} {...props} />
            },
            p: ({ className, children }) => {
              const isAlertTitle = className?.includes('markdown-alert-title')

              if (isAlertTitle && typeof children === 'string') {
                const alertType = children.toLocaleLowerCase().trim() as AlertType
                const config = alertConfig[alertType]

                if (config) {
                  return (
                    <p className={className}>
                      <IconV2 name={config.icon as IconV2NamesType} size="md" />
                      {config.title}
                    </p>
                  )
                }
              }

              return <p className={className}>{children}</p>
            },
            pre: ({ children, node }) => {
              const code = node && node.children ? getCodeString(node.children) : (children as string)

              let codeContent = ''

              if (typeof code === 'string') {
                codeContent = code
              }

              const { isSuggestion, codeLines } = getIsSuggestion(codeContent)

              const filteredLines =
                codeLines.length > 0 && codeLines[codeLines.length - 1] === '' ? codeLines.slice(0, -1) : codeLines
              const hasLineNumbers = showLineNumbers && filteredLines.length > 1

              if (isSuggestion) {
                return (
                  <div className="rounded-cn-2 overflow-hidden border">
                    <div className="bg-cn-2 px-cn-md py-cn-sm border-b">
                      <Text variant="body-strong" color="foreground-1" className="!m-0">
                        {suggestionTitle}
                      </Text>
                    </div>
                    <pre>{children}</pre>
                    <div className="p-cn-md">{suggestionFooter}</div>
                  </div>
                )
              }

              return (
                <div
                  className={cn(
                    'min-h-[52px] mb-cn-md bg-cn-2 rounded-cn-2 pl-cn-md pr-cn-sm py-cn-sm relative overflow-hidden border',
                    { '!pt-[15px]': codeLines.length === 1 }
                  )}
                >
                  <CopyButton
                    className="right-cn-sm top-cn-sm absolute z-10"
                    buttonVariant="outline"
                    name={code}
                    iconSize="xs"
                    size="xs"
                  />
                  <pre>
                    {hasLineNumbers ? (
                      <div className="relative flex w-full bg-transparent">
                        <div className="bg-cn-2 flex-none select-none text-right">
                          {filteredLines.map((_, i) => (
                            <Text as="span" key={i} className="pr-cn-sm block pt-[0.5px]">
                              {i + 1}
                            </Text>
                          ))}
                        </div>
                        <div className="relative flex-1 overflow-hidden bg-transparent">{children}</div>
                      </div>
                    ) : (
                      children
                    )}
                  </pre>
                </div>
              )
            },
            code: ({ children = [], className: _className, ...props }) => {
              const code = props.node && props.node.children ? getCodeString(props.node.children) : children

              const isPossibleSuggestion =
                typeof code === 'string' &&
                typeof _className === 'string' &&
                'language-suggestion' === _className.split(' ')[0].toLocaleLowerCase()

              if (isPossibleSuggestion) {
                const { isSuggestion } = getIsSuggestion(code)

                if (isSuggestion) {
                  return <CodeSuggestionBlock code={code} suggestionBlock={suggestionBlock} />
                }
              }

              return <code className={`mr-cn-3xl !whitespace-pre-wrap ${String(_className)}`}>{children}</code>
            }
          }}
        />
      </div>
    </div>
  )
}

MarkdownViewerLocal.displayName = 'MarkdownViewer'

const MarkdownViewer = memo(MarkdownViewerLocal)

export { MarkdownViewer }
