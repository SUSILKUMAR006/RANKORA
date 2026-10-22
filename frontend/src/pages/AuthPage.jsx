import { Check, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard.jsx'
import AuthInput from '../components/auth/AuthInput.jsx'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import PasswordInput from '../components/auth/PasswordInput.jsx'
import Button from '../components/common/Button.jsx'
import { authService } from '../services/authService.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getStrength(password) {
  if (password.length < 6)
    return { label: 'Weak', tone: 'bg-penalty-400 shadow-[0_0_8px_rgba(255,77,94,0.8)]', text: 'text-penalty-300', width: 'w-1/3' }
  if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return { label: 'Medium', tone: 'bg-gold-400 shadow-[0_0_8px_rgba(255,194,51,0.7)]', text: 'text-gold-300', width: 'w-2/3' }
  return { label: 'Strong', tone: 'bg-clear-400 shadow-[0_0_8px_rgba(52,217,156,0.7)]', text: 'text-clear-300', width: 'w-full' }
}

// Square System checkbox: hollow frame, fills with glowing blue when checked.
const checkboxClass =
  'h-4 w-4 shrink-0 cursor-pointer appearance-none border border-edge-strong bg-void-950 transition-[border-color,background-color,box-shadow] hover:border-system-400 checked:border-system-400 checked:bg-system-400 checked:shadow-[0_0_10px_rgba(30,144,255,0.7),inset_0_0_0_3px_var(--color-void-950)]'

function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [apiError, setApiError] = useState('')
  const strength = getStrength(form.password)

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setApiError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (isRegister && !form.name.trim()) nextErrors.name = 'Player name is required.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.password) nextErrors.password = 'Password is required.'
    if (isRegister && form.password !== form.confirmPassword)
      nextErrors.confirmPassword = 'Passwords must match.'
    if (isRegister && !form.terms) nextErrors.terms = 'Accept the terms to begin your awakening.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setApiError('')

    try {
      if (isRegister) {
        const result = await authService.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        })
        setStatus('success')
        setTimeout(() => navigate('/awakening'), 600)
      } else {
        const result = await authService.login({
          email: form.email.trim(),
          password: form.password,
        })
        if (form.remember) {
          localStorage.setItem('rankora_remembered_email', form.email.trim())
        }
        setStatus('success')
        setTimeout(() => navigate('/dashboard'), 600)
      }
    } catch (err) {
      setStatus('idle')
      setApiError(err?.message || 'Authentication error. Check your credentials.')
    }
  }

  return (
    <AuthLayout mode={mode}>
      <AuthCard>
        <div className="mb-7 text-center">
          <p className="label-caps flex items-center justify-center gap-2 text-system-300">
            <span className="h-1.5 w-1.5 rotate-45 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" />
            {isRegister ? 'Player registration' : 'System access'}
            <span className="h-1.5 w-1.5 rotate-45 bg-system-400 shadow-[0_0_8px_rgba(74,174,255,0.9)]" />
          </p>
          <h2 className="sys-title mt-3 text-2xl leading-tight sm:text-3xl">
            {isRegister ? 'Create your Player' : 'Welcome back, Player'}
          </h2>
          <p className="mt-2 text-sm text-frost-400">
            {isRegister ? 'Your progression begins today.' : 'Continue your progression.'}
          </p>
          <div className="mx-auto mt-5 h-px w-2/3 bg-linear-to-r from-transparent via-system-400/70 to-transparent" />
        </div>

        {apiError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 border border-penalty-400/60 bg-penalty-500/10 px-3 py-2.5 shadow-[0_0_16px_-6px_rgba(240,42,62,0.6)]"
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center border border-penalty-400 font-display text-xs font-bold text-penalty-200">
              !
            </span>
            <p className="min-w-0 font-mono text-xs leading-5 text-penalty-200">{apiError}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={submit} noValidate>
          {isRegister && (
            <AuthInput
              label="Player Name"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Choose your identity"
              error={errors.name}
              autoComplete="name"
            />
          )}

          <AuthInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@domain.com"
            error={errors.email}
            autoComplete="email"
          />

          {isRegister ? (
            <>
              <PasswordInput
                name="password"
                value={form.password}
                onChange={updateField}
                error={errors.password}
                autoComplete="new-password"
              />
              <div>
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={updateField}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <div className="mt-3">
                  <div className="label-caps flex items-center justify-between text-frost-600">
                    <span>Password strength</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="relative mt-2 h-1.5 overflow-hidden border border-edge bg-void-950">
                    <div className={`h-full transition-all duration-300 ${strength.tone} ${strength.width}`} />
                    <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_calc(33.333%-1px),rgba(3,5,10,0.9)_calc(33.333%-1px)_33.333%)]" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <PasswordInput
              value={form.password}
              onChange={updateField}
              error={errors.password}
            />
          )}

          {isRegister ? (
            <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-frost-400">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={updateField}
                className={`mt-0.5 ${checkboxClass}`}
              />
              <span>
                I accept the{' '}
                <button
                  type="button"
                  className="text-system-300 underline decoration-system-500/40 underline-offset-4 transition-colors hover:text-frost-50"
                >
                  RANKORA terms
                </button>
                .{errors.terms && (
                  <span className="mt-1 block font-mono text-penalty-300">
                    <span className="font-display font-bold">[!]</span> {errors.terms}
                  </span>
                )}
              </span>
            </label>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex cursor-pointer items-center gap-2.5 text-frost-400">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={updateField}
                  className={checkboxClass}
                />
                Remember me
              </label>
              <button type="button" className="text-system-300 transition-colors hover:text-frost-50">
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            loading={status === 'loading'}
            variant={status === 'success' ? 'success' : 'primary'}
            className="min-h-12 w-full text-base tracking-[0.24em]"
          >
            {status === 'loading' ? (
              'Authenticating with System...'
            ) : status === 'success' ? (
              <>
                <Check size={16} /> Access granted
              </>
            ) : (
              <>
                <LockKeyhole size={16} />
                {isRegister ? 'Accept' : 'Enter'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-7 border-t border-edge pt-5 text-center text-sm text-frost-500">
          {isRegister ? 'Already a Player?' : 'New player?'}{' '}
          <Link
            to={isRegister ? '/login' : '/register'}
            className="label-caps ml-1 text-system-300 transition-colors hover:text-frost-50"
          >
            {isRegister ? 'Log in' : 'Create your account'}
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}

export default AuthPage
