import { useState, type ChangeEvent, type FormEvent } from 'react'

export type SignupData = {
  name: string
  email: string
  password: string
}

type SignupFormProps = {
  onSubmit: (data: SignupData) => Promise<void>
}

type Errors = Partial<Record<'name' | 'email' | 'password' | 'acceptTerms' | 'form', string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [welcomeName, setWelcomeName] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validatePassword = () => {
    setErrors((prev) => {
      const updated = { ...prev }
      if (values.password.length < MIN_PASSWORD_LENGTH) {
        updated.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      } else {
        delete updated.password
      }
      return updated
    })
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (!values.name.trim()) next.name = 'Name is required'
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Please enter a valid email'
    if (values.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    }
    if (!values.acceptTerms) next.acceptTerms = 'You must accept the terms'
    return next
  }

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (submitting) return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const trimmedName = values.name.trim()
      await onSubmit({
        name: trimmedName,
        email: values.email.trim(),
        password: values.password,
      })
      setWelcomeName(trimmedName)
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (welcomeName) {
    return (
      <div className="welcome" role="status">
        Welcome, <strong>{welcomeName}</strong>! Check your inbox to confirm your email.
      </div>
    )
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="signup-name">Full name</label>
        <input
          id="signup-name"
          name="name"
          placeholder="Full name"
          value={values.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'error-name' : undefined}
        />
        {errors.name && (
          <span id="error-name" className="error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'error-email' : undefined}
        />
        {errors.email && (
          <span id="error-email" className="error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          onBlur={validatePassword}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'error-password' : undefined}
        />
        {errors.password && (
          <span id="error-password" className="error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="terms">
        <label htmlFor="signup-terms">
          <input
            id="signup-terms"
            name="acceptTerms"
            type="checkbox"
            checked={values.acceptTerms}
            onChange={handleChange}
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={errors.acceptTerms ? 'error-terms' : undefined}
          />
          <span>I accept the terms and conditions</span>
        </label>
      </div>
      {errors.acceptTerms && (
        <span id="error-terms" className="error" role="alert">
          {errors.acceptTerms}
        </span>
      )}

      {errors.form && (
        <span className="error" role="alert">
          {errors.form}
        </span>
      )}

      <button
        type="submit"
        className={submitting ? 'btn btn-primary is-loading' : 'btn btn-primary'}
        disabled={submitting}
      >
        {submitting ? 'Creating account...' : 'Create account'}
      </button>

      <style>{`.signup-form .error { color: #b91c1c; font-size: 0.85rem; }`}</style>
    </form>
  )
}