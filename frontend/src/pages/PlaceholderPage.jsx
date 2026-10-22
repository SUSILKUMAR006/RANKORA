import { ArrowRight, Shield } from 'lucide-react'
import SystemWindow from '../components/common/SystemWindow.jsx'

function PlaceholderPage({ title }) {
  const label = title.charAt(0).toUpperCase() + title.slice(1)

  return (
    <section className="grid min-h-[60vh] place-items-center py-12">
      <SystemWindow title="Notification" align="center" className="w-full max-w-xl" bodyClassName="px-6 py-10 text-center sm:px-10">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center border border-system-400 bg-system-500/10 text-system-200 shadow-[0_0_24px_-4px_rgba(30,144,255,0.6)]">
          <Shield size={26} />
        </div>
        <p className="label-caps mb-3 text-system-300">Rankora / foundation</p>
        <h1 className="sys-title text-3xl leading-tight sm:text-5xl">{label}</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-frost-400">
          This route is ready for the {title} experience. Product systems will be added in a later build.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 border border-edge bg-void-950/60 px-4 py-2 font-mono text-xs text-frost-400">
          <span className="h-1.5 w-1.5 animate-sys-pulse bg-system-400 shadow-[0_0_6px_rgba(74,174,255,0.9)]" />
          Module pending <ArrowRight size={14} className="text-system-300" />
        </div>
      </SystemWindow>
    </section>
  )
}

export default PlaceholderPage
