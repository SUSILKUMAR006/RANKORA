import { useEffect, useRef } from 'react'
import { tsParticles } from '@tsparticles/engine'
import { loadFull } from 'tsparticles'

const TRAIL_LIFETIME = 480 // ms — how long a glow-trail point lingers
const MAX_POINTS = 24

let burstSeq = 0
let enginePromise = null

function ensureEngine() {
  if (!enginePromise) enginePromise = loadFull(tsParticles)
  return enginePromise
}

// One-shot explosive burst of energy debris at (x, y), layered behind the
// ring shockwave for extra sparkle. Spawns an isolated tsParticles
// container, lets it fully burn out, then tears itself down.
async function spawnEnergyBurst(x, y) {
  await ensureEngine()

  const id = `sl-burst-${++burstSeq}`
  const el = document.createElement('div')
  el.id = id
  el.style.position = 'fixed'
  el.style.left = `${x - 260}px`
  el.style.top = `${y - 260}px`
  el.style.width = '520px'
  el.style.height = '520px'
  el.style.pointerEvents = 'none'
  el.style.zIndex = '9998'
  document.body.appendChild(el)

  const container = await tsParticles.load({
    id,
    element: el,
    options: {
      fullScreen: { enable: false },
      detectRetina: true,
      background: { color: 'transparent' },
      particles: {
        number: { value: 0 },
        color: { value: ['#f5f3ff', '#c4b5fd', '#8b5cf6', '#4c1d95', '#22d3ee'] },
        shape: { type: ['circle', 'star'] },
        opacity: {
          value: { min: 0, max: 1 },
          animation: { enable: true, speed: 1.6, startValue: 'max', destroy: 'min' },
        },
        size: {
          value: { min: 1, max: 5 },
          animation: { enable: true, speed: 6, startValue: 'max', destroy: 'min' },
        },
        move: {
          enable: true,
          speed: { min: 6, max: 22 },
          decay: 0.09,
          direction: 'none',
          outModes: { default: 'destroy' },
        },
        life: { duration: { value: 1 }, count: 1 },
      },
      emitters: {
        position: { x: 50, y: 50 },
        rate: { quantity: 40, delay: 0 },
        life: { count: 1, duration: 0.08 },
        particles: {
          move: { direction: 'none' },
        },
      },
    },
  })

  window.setTimeout(() => {
    container?.destroy()
    el.remove()
  }, 1400)
}

// Anime-style expanding ring shockwave — a bright energy-release pulse that
// rapidly grows outward from the click point and fades, like an impact
// wave in Solo Leveling.
function spawnShockwave(x, y) {
  const wrapper = document.createElement('div')
  wrapper.className = 'sl-wave-wrapper'
  wrapper.style.left = `${x}px`
  wrapper.style.top = `${y}px`
  wrapper.innerHTML =
    '<span class="sl-wave-ring sl-wave-ring-a"></span>' +
    '<span class="sl-wave-ring sl-wave-ring-b"></span>' +
    '<span class="sl-wave-core"></span>'
  document.body.appendChild(wrapper)
  window.setTimeout(() => wrapper.remove(), 750)
}

function triggerShake() {
  document.body.classList.add('sl-screen-shake')
  window.setTimeout(() => document.body.classList.remove('sl-screen-shake'), 260)
}

function SwordCursor() {
  const canvasRef = useRef(null)
  const orbRef = useRef(null)
  const pointsRef = useRef([])
  const mouse = useRef({ x: -100, y: -100 })
  const smooth = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)

  useEffect(() => {
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches
    if (isCoarsePointer) return

    document.body.classList.add('sl-cursor-active')
    ensureEngine()

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const hideOnLeave = () => {
      mouse.current.x = -100
      mouse.current.y = -100
    }

    const handleDown = (e) => {
      spawnShockwave(e.clientX, e.clientY)
      spawnEnergyBurst(e.clientX, e.clientY)
      triggerShake()
      if (orbRef.current) {
        orbRef.current.classList.remove('sl-orb-pulse')
        // restart the pulse animation on click for extra feedback
        void orbRef.current.offsetWidth
        orbRef.current.classList.add('sl-orb-pulse')
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseleave', hideOnLeave)

    const tick = () => {
      const now = performance.now()

      // Ease the orb toward the real pointer for a light "floating" lag
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.22
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.22

      pointsRef.current.push({ x: smooth.current.x, y: smooth.current.y, t: now })
      if (pointsRef.current.length > MAX_POINTS) pointsRef.current.shift()

      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${smooth.current.x}px, ${smooth.current.y}px)`
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      pointsRef.current = pointsRef.current.filter((p) => now - p.t < TRAIL_LIFETIME)
      const pts = pointsRef.current
      for (const p of pts) {
        const age = (now - p.t) / TRAIL_LIFETIME
        const alpha = Math.max(0, 1 - age)
        if (alpha <= 0) continue
        const radius = Math.max(0.6, 6 * (1 - age * 0.7))

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.4)
        grad.addColorStop(0, `rgba(216, 200, 255, ${alpha * 0.7})`)
        grad.addColorStop(0.55, `rgba(139, 92, 246, ${alpha * 0.4})`)
        grad.addColorStop(1, 'rgba(76, 29, 149, 0)')
        ctx.fillStyle = grad
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('sl-cursor-active')
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseleave', hideOnLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden="true"
      />
      <div ref={orbRef} className="sl-orb pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform" aria-hidden="true">
        <span className="sl-orb-core" />
        <span className="sl-orb-halo" />
      </div>
    </>
  )
}

export default SwordCursor
