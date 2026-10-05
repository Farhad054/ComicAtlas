import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AdaptationBridge } from '@/components/AdaptationBridge'

describe('AdaptationBridge', () => {
  it('renders for spider-man', () => {
    render(<AdaptationBridge characterSlug="spider-man" publisherSlug="marvel" />)
    expect(screen.getByText(/came from a film/i)).toBeInTheDocument()
  })

  it('renders for batman', () => {
    render(<AdaptationBridge characterSlug="batman" publisherSlug="dc" />)
    expect(screen.getByText(/came from a film/i)).toBeInTheDocument()
  })

  it('renders nothing for other characters', () => {
    const { container } = render(<AdaptationBridge characterSlug="thor" publisherSlug="marvel" />)
    expect(container.firstChild).toBeNull()
  })
})
