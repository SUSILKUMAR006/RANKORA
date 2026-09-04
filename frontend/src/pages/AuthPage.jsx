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
    return { label: 'Weak', tone: 'bg-rose-300', text: 'text-rose-200', width: 'w-1/3' }
  if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return { label: 'Medium', tone: 'bg-amber-300', text: 'text-amber-200', width: 'w-2/3' }
  return { label: 'Strong', tone: 'bg-emerald-300', text: 'text-emerald-200', width: 'w-full' }
}

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
        <div className="mb-8">
          <p className="label-caps text-cyan-300/70">
            {isRegister ? 'Initialize player' : 'System access'}
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
            {isRegister ? 'Create Your Player' : 'Welcome Back, Player'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isRegister ? 'Your progression begins today.' : 'Continue your progression.'}
          </p>
        </div>

        {apiError && (
          <div className="mb-5 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-300 font-mono">
            {apiError}
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
                  <div className="flex items-center justify-between label-caps text-slate-600">
                    <span>Password strength</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.tone} ${strength.width}`}
                    />
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
            <label className="flex items-start gap-3 text-xs leading-5 text-slate-500">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={updateField}
                className="mt-1 h-4 w-4 accent-cyan-300"
              />
              <span>
                I accept the{' '}
                <button type="button" className="text-cyan-200 hover:text-white">
                  RANKORA terms
                </button>
                .{errors.terms && (
                  <span className="mt-1 block text-rose-300">{errors.terms}</span>
                )}
              </span>
            </label>
          ) : (
            <div className="flex items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 text-slate-500">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={updateField}
                  className="h-4 w-4 accent-cyan-300"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-cyan-200 transition hover:text-white"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            loading={status === 'loading'}
            variant={status === 'success' ? 'success' : 'primary'}
            className="min-h-12 w-full"
          >
            {status === 'loading' ? (
              'Authenticating with system...'
            ) : status === 'success' ? (
              <>
                <Check size={16} /> Access granted
              </>
            ) : (
              <>
                <LockKeyhole size={16} />
                {isRegister ? 'BEGIN AWAKENING' : 'ENTER RANKORA'}
              </>
            )}
          </Button>
        </form>

        <div className="mt-7 border-t border-white/10 pt-5 text-center text-sm text-slate-500">
          {isRegister ? 'Already have an account?' : 'New player?'}{' '}
          <Link
            to={isRegister ? '/login' : '/register'}
            className="font-medium text-cyan-200 transition hover:text-white"
          >
            {isRegister ? 'Login' : 'Create your account'}
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}

export default AuthPage
