import { useEffect, useRef } from 'react'
import { tsParticles } from '@tsparticles/engine'
import { loadFull } from 'tsparticles'

const TRAIL_LIFETIME = 320 // ms — how long a slash ribbon segment lives
const MAX_POINTS = 18
const PARTICLE_LIFETIME = 900 // ms — how long a shadow particle drifts before fading

let burstSeq = 0
let enginePromise = null

function ensureEngine() {
  if (!enginePromise) enginePromise = loadFull(tsParticles)
  return enginePromise
}

// One-shot explosive burst of shadow/energy particles at (x, y) — like the
// Shadow Monarch's dagger detonating on impact. Spawns an isolated
// tsParticles container over the click point, lets it fully burn out, then
// tears itself down so we never accumulate live canvases.
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
  el.style.zIndex = '10000'
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
        rate: { quantity: 55, delay: 0 },
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

function SwordCursor() {
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)
  const pointsRef = useRef([])
  const particlesRef = useRef([])
  const mouse = useRef({ x: -100, y: -100 })
  const smooth = useRef({ x: -100, y: -100, angle: -45 })
  const rafRef = useRef(null)
  const lastParticleRef = useRef(0)

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
      pointsRef.current.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      if (pointsRef.current.length > MAX_POINTS) pointsRef.current.shift()
    }

    const triggerShake = () => {
      document.body.classList.add('sl-screen-shake')
      window.setTimeout(() => document.body.classList.remove('sl-screen-shake'), 260)
    }

    const spawnSlash = (x, y) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'sl-xslash-wrapper'
      wrapper.style.left = `${x}px`
      wrapper.style.top = `${y}px`
      wrapper.innerHTML =
        '<span class="sl-xslash-line sl-xslash-a"></span>' +
        '<span class="sl-xslash-line sl-xslash-b"></span>' +
        '<span class="sl-xslash-flash"></span>'
      document.body.appendChild(wrapper)
      window.setTimeout(() => wrapper.remove(), 480)
      triggerShake()
      spawnEnergyBurst(x, y)
    }

    const handleDown = (e) => spawnSlash(e.clientX, e.clientY)

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mousedown', handleDown)

    const hideOnLeave = () => {
      mouse.current.x = -100
      mouse.current.y = -100
    }
    window.addEventListener('mouseleave', hideOnLeave)

    let lastX = mouse.current.x
    let lastY = mouse.current.y

    const tick = () => {
      const now = performance.now()

      // Ease the blade toward the real pointer
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.35
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.35

      const dx = mouse.current.x - lastX
      const dy = mouse.current.y - lastY
      const speed = Math.hypot(dx, dy)
      if (speed > 1.5) {
        const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 45
        let delta = targetAngle - smooth.current.angle
        delta = ((delta + 180) % 360) - 180
        smooth.current.angle += delta * 0.28

        // Spawn shadow-essence particles trailing the blade while moving
        if (now - lastParticleRef.current > 28) {
          lastParticleRef.current = now
          particlesRef.current.push({
            x: smooth.current.x + (Math.random() - 0.5) * 6,
            y: smooth.current.y + (Math.random() - 0.5) * 6,
            t: now,
            r: 2 + Math.random() * 2.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: 0.35 + Math.random() * 0.5,
          })
          if (particlesRef.current.length > 90) particlesRef.current.shift()
        }
      }
      lastX = mouse.current.x
      lastY = mouse.current.y

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${smooth.current.x}px, ${smooth.current.y}px) rotate(${smooth.current.angle}deg)`
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Shadow particles: dark violet embers drifting and fading behind the blade
      particlesRef.current = particlesRef.current.filter((p) => now - p.t < PARTICLE_LIFETIME)
      for (const p of particlesRef.current) {
        const age = (now - p.t) / PARTICLE_LIFETIME
        const alpha = Math.max(0, 1 - age)
        const x = p.x + p.vx * (now - p.t) * 0.05
        const y = p.y + p.vy * (now - p.t) * 0.05
        const radius = p.r * (1 - age * 0.6)

        ctx.beginPath()
        ctx.arc(x, y, Math.max(0.4, radius), 0, Math.PI * 2)
        const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, radius * 2.2))
        grad.addColorStop(0, `rgba(196, 181, 253, ${alpha * 0.85})`)
        grad.addColorStop(0.5, `rgba(109, 40, 217, ${alpha * 0.55})`)
        grad.addColorStop(1, 'rgba(20, 10, 40, 0)')
        ctx.fillStyle = grad
        ctx.fill()
      }

      // Slash trail: tapered ribbon quads instead of a thin line, for a real sword-swing streak
      pointsRef.current = pointsRef.current.filter((p) => now - p.t < TRAIL_LIFETIME)
      const pts = pointsRef.current

      if (pts.length > 1) {
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1]
          const p1 = pts[i]
          const age = (now - p1.t) / TRAIL_LIFETIME
          const alpha = Math.max(0, 1 - age)
          if (alpha <= 0) continue

          const segDx = p1.x - p0.x
          const segDy = p1.y - p0.y
          const len = Math.hypot(segDx, segDy) || 1
          const nx = -segDy / len
          const ny = segDx / len
          const halfWidth = Math.max(0.6, 9 * (1 - age))

          ctx.beginPath()
          ctx.moveTo(p0.x + nx * halfWidth, p0.y + ny * halfWidth)
          ctx.lineTo(p1.x + nx * halfWidth * 0.4, p1.y + ny * halfWidth * 0.4)
          ctx.lineTo(p1.x - nx * halfWidth * 0.4, p1.y - ny * halfWidth * 0.4)
          ctx.lineTo(p0.x - nx * halfWidth, p0.y - ny * halfWidth)
          ctx.closePath()

          const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y)
          grad.addColorStop(0, `rgba(237, 233, 254, ${alpha * 0.05})`)
          grad.addColorStop(1, `rgba(196, 181, 253, ${alpha * 0.75})`)
          ctx.fillStyle = grad
          ctx.shadowColor = `rgba(139, 92, 246, ${alpha})`
          ctx.shadowBlur = 16
          ctx.fill()
        }

        // Bright hot core along the freshest part of the swing
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
        ctx.strokeStyle = 'rgba(245, 243, 255, 0.55)'
        ctx.lineWidth = 1.4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.shadowColor = 'rgba(224, 214, 255, 0.9)'
        ctx.shadowBlur = 10
        ctx.stroke()
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
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        aria-hidden="true"
      >
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          style={{
            transform: 'translate(-9px, -40px)',
            filter:
              'drop-shadow(0 0 8px rgba(196,181,253,0.95)) drop-shadow(0 0 22px rgba(109,40,217,0.65)) drop-shadow(0 0 40px rgba(76,29,149,0.35))',
          }}
        >
          {/* long katana blade with curved tip */}
          <path
            d="M14 2 L18 2 L20 6 L19 34 Q19 38 15.8 40 L14.2 40 Q12 38 12 34 L11 6 Z"
            fill="url(#slBladeGradient)"
            stroke="rgba(237,233,254,0.95)"
            strokeWidth="0.6"
          />
          {/* center fuller / glow line down the blade */}
          <line x1="15.4" y1="4" x2="15" y2="36" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
          {/* edge glint */}
          <path d="M18.6 5 L18 22" stroke="rgba(255,255,255,0.75)" strokeWidth="0.6" strokeLinecap="round" />
          {/* tsuba / guard */}
          <ellipse cx="15" cy="40.5" rx="9.5" ry="2.4" fill="#241b3d" stroke="#a78bfa" strokeWidth="0.7" />
          {/* grip wrap */}
          <rect x="12" y="42.6" width="6" height="8.5" rx="1.6" fill="#160f28" stroke="#7c3aed" strokeWidth="0.6" />
          <line x1="12" y1="45" x2="18" y2="45.9" stroke="#a78bfa" strokeWidth="0.5" opacity="0.6" />
          <line x1="12" y1="48" x2="18" y2="48.9" stroke="#a78bfa" strokeWidth="0.5" opacity="0.6" />
          {/* pommel cap */}
          <circle cx="15" cy="51" r="2.1" fill="#c4b5fd" />
          <defs>
            <linearGradient id="slBladeGradient" x1="15" y1="2" x2="15" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ddd6fe" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}

export default SwordCursor
