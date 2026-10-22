function AuthInput({ label, name, type = 'text', value, onChange, placeholder, error, autoComplete, ...props }) {
  return (
    <label className="block">
      <span className={`label-caps mb-1.5 block ${error ? 'text-penalty-300' : 'text-frost-400'}`}>{label}</span>
      <input
        className={`field min-h-11 ${error ? 'border-penalty-400/70! focus:shadow-[0_0_0_3px_rgba(240,42,62,0.15),0_0_16px_rgba(240,42,62,0.15)]!' : ''}`}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-penalty-300">
          <span className="font-display font-bold">[!]</span> {error}
        </p>
      )}
    </label>
  )
}

export default AuthInput
