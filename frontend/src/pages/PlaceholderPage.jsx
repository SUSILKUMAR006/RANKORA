import { ArrowRight, Shield } from 'lucide-react'

function PlaceholderPage({ title }) {
  const label = title.charAt(0).toUpperCase() + title.slice(1)

  return (
    <section className="grid min-h-[60vh] place-items-center py-12">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_40px_rgba(103,232,249,0.12)]">
          <Shield size={28} />
        </div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/70">Rankora / foundation</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{label}</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-400">This route is ready for the {title} experience. Product systems will be added in a later build.</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs text-slate-400">
          Module pending <ArrowRight size={14} className="text-cyan-300" />
        </div>
      </div>
    </section>
  )
}

export default PlaceholderPage