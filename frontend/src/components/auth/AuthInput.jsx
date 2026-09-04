import { motion } from 'framer-motion'

function AuthInput({ label, name, type = 'text', value, onChange, placeholder, error, autoComplete, ...props }) {
  return <label className="block"><span className="label-caps text-slate-400">{label}</span><motion.input whileFocus={{ scale: 1.01 }} transition={{ duration: 0.16 }} className={`mt-2 block min-h-12 w-full rounded-xl border bg-white/4 px-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:shadow-[0_0_22px_rgba(103,232,249,0.08)] ${error ? 'border-rose-300/50' : 'border-white/10'}`} id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...props} />{error && <p id={`${name}-error`} className="mt-2 text-xs text-rose-300">{error}</p>}</label>
}

export default AuthInput
