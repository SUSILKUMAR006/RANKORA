import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const copy = {
  login: {
    eyebrow: 'Player detected',
    lines: ['Welcome back,', 'Player.'],
    body: 'The System has been waiting. Your daily quests have been refreshed.',
  },
  register: {
    eyebrow: 'Notification',
    lines: ['You have acquired', 'the qualifications', 'to be a Player.'],
    body: 'Will you accept? Turn daily actions into quests, earn EXP, and climb from E-Rank to S.',
  },
}

const ranks = ['E', 'D', 'C', 'B', 'A', 'S']

function AuthLayout({ children, mode }) {
  const text = copy[mode] || copy.login

  return (
    <div className="relative min-h-screen overflow-hidden text-frost-200">
      {/* Gate glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-20%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-system-500/10 blur-[120px]" />
      {/* Moving scan line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 animate-sys-scan bg-linear-to-b from-transparent via-system-400/[0.04] to-transparent" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-360 gap-10 px-5 py-6 lg:grid-cols-[1fr_minmax(24rem,30rem)] lg:items-center lg:gap-20 lg:px-12">
        <header className="flex items-center justify-between lg:absolute lg:left-12 lg:right-12 lg:top-8">
          <NavLink to="/login" className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center">
              <span className="absolute inset-0 rotate-45 border border-system-400 bg-system-500/15 shadow-[0_0_16px_rgba(30,144,255,0.5)]" />
              <span className="relative font-display text-lg font-bold text-frost-50 sys-glow">R</span>
            </span>
            <span className="sys-title text-xl tracking-[0.28em]">Rankora</span>
          </NavLink>
          <span className="label-caps text-frost-600">{mode === 'login' ? 'System access' : 'Player registration'}</span>
        </header>

        <section className="flex items-center pt-6 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="label-caps flex items-center gap-2 text-system-300">
              <span className="grid h-5 w-5 place-items-center border border-system-400 font-display text-xs font-bold text-system-200">!</span>
              {text.eyebrow}
            </p>
            <h1 className="sys-title mt-5 text-4xl leading-[0.98] sm:text-6xl">
              {text.lines.map((line, index) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.12, duration: 0.4 }}
                >
                  {index === text.lines.length - 1 ? <span className="text-system-300">{line}</span> : line}
                </motion.span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-frost-400">{text.body}</p>

            <div className="mt-10 hidden items-center gap-3 sm:flex">
              <span className="label-caps mr-2 text-frost-600">Hunter ranks</span>
              {ranks.map((rank, index) => (
                <motion.span
                  key={rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  className={`grid h-8 w-8 place-items-center border font-display text-sm font-bold ${
                    rank === 'S'
                      ? 'border-gold-400 text-gold-200 shadow-[0_0_14px_rgba(255,194,51,0.5)]'
                      : 'border-edge-strong text-frost-400'
                  }`}
                >
                  {rank}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="flex items-center justify-center pb-6 lg:pb-0">{children}</section>
      </div>
    </div>
  )
}

export default AuthLayout
