import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import AuthInput from './AuthInput.jsx'

function PasswordInput({ label = 'Password', name = 'password', value, onChange, error, autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false)
  return <div className="relative"><AuthInput label={label} name={name} type={visible ? 'text' : 'password'} value={value} onChange={onChange} error={error} autoComplete={autoComplete} placeholder="Enter secure passphrase" /><button type="button" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={() => setVisible((isVisible) => !isVisible)} className="absolute right-3 top-8 rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-cyan-200">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
}

export default PasswordInput
