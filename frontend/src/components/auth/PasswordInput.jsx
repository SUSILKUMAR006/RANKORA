import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import AuthInput from './AuthInput.jsx'

function PasswordInput({ label = 'Password', name = 'password', value, onChange, error, autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative [&_input]:pr-11">
      <AuthInput
        label={label}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        error={error}
        autoComplete={autoComplete}
        placeholder="Enter secure passphrase"
      />
      <button
        type="button"
        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        onClick={() => setVisible((isVisible) => !isVisible)}
        className="absolute right-1.5 top-7 grid h-8 w-8 place-items-center border border-transparent text-frost-500 transition-colors hover:border-edge hover:text-system-200"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

export default PasswordInput
