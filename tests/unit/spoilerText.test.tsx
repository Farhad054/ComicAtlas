import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SpoilerText } from '@/components/SpoilerText'

describe('SpoilerText', () => {
  it('renders the value when visible', () => {
    render(<SpoilerText value={{ hidden: false, value: 'Superman dies' }} />)
    expect(screen.getByText('Superman dies')).toBeInTheDocument()
  })

  it('renders only the placeholder when hidden', () => {
    const { container } = render(<SpoilerText value={{ hidden: true }} />)
    expect(screen.getByText(/hidden until/i)).toBeInTheDocument()
    expect(container.textContent).not.toContain('Superman')
  })
})
