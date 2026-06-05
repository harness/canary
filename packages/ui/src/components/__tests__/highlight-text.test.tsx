import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { HighlightText } from '../highlight-text'

const getMark = (textContent: string) =>
  screen.getByText(
    (_content, element) =>
      element?.tagName.toLowerCase() === 'mark' && element?.textContent?.toLowerCase() === textContent.toLowerCase()
  )

describe('HighlightText', () => {
  test('wraps the matched substring in a <mark>', () => {
    render(<HighlightText text="feature/login" match="feat" />)

    expect(getMark('feat')).toBeInTheDocument()
    // the full text is still present
    expect(screen.getByText(/login/)).toBeInTheDocument()
  })

  test('renders plain text without <mark> when match is empty', () => {
    const { container } = render(<HighlightText text="develop" match="" />)

    expect(container.querySelector('mark')).not.toBeInTheDocument()
    expect(screen.getByText('develop')).toBeInTheDocument()
  })

  test('renders plain text without <mark> when match is null', () => {
    const { container } = render(<HighlightText text="develop" match={null} />)

    expect(container.querySelector('mark')).not.toBeInTheDocument()
    expect(screen.getByText('develop')).toBeInTheDocument()
  })

  test('renders plain text without <mark> when there is no match', () => {
    const { container } = render(<HighlightText text="develop" match="xyz" />)

    expect(container.querySelector('mark')).not.toBeInTheDocument()
    expect(screen.getByText('develop')).toBeInTheDocument()
  })

  test('highlights case-insensitively', () => {
    render(<HighlightText text="Develop" match="dev" />)

    expect(getMark('dev')).toBeInTheDocument()
  })

  test('highlights matches containing special characters', () => {
    render(<HighlightText text="release/v1.2" match="v1.2" />)

    expect(getMark('v1.2')).toBeInTheDocument()
  })

  test('applies the provided className to the wrapper', () => {
    const { container } = render(<HighlightText text="develop" match="dev" className="custom-highlight" />)

    expect(container.querySelector('.custom-highlight')).toBeInTheDocument()
  })
})
