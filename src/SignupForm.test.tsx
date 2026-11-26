import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SignupForm } from './SignupForm'

describe('SignupForm', () => {
  it('submits the form and shows a welcome message', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<SignupForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText('Full name'), 'Ana López')
    await user.type(screen.getByPlaceholderText('Email'), 'ana@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'correct-horse')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByText('Create account'))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana López',
      email: 'ana@example.com',
      password: 'correct-horse',
    })
    const welcome = await screen.findByText(/check your inbox/i)
    expect(welcome.textContent).toContain('Ana López')
  })

  it('shows errors when required fields are missing', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SignupForm onSubmit={onSubmit} />)

    await user.click(screen.getByText('Create account'))

    expect(screen.getByText('Name is required')).toBeTruthy()
    expect(screen.getByText('Please enter a valid email')).toBeTruthy()
    expect(screen.getByText('You must accept the terms')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
