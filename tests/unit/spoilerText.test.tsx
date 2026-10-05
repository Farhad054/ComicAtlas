import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SpoilerText } from '@/components/SpoilerText'

describe('SpoilerText', () => {
  it('renders text when spoiler mode is off', () => {
    render(<SpoilerText text="Superman dies" spoilerMode={false} />)
    expect(screen.getByText('Superman dies')).toBeInTheDocument()
  })

  it('hides text when spoiler mode is on', () => {
    render(<SpoilerText text="Superman dies" spoilerMode={true} />)
    expect(screen.queryByText('Superman dies')).not.toBeInTheDocument()
    expect(screen.getByText(/hidden until/i)).toBeInTheDocument()
  })
})
