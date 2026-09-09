import { useEffect, useRef } from 'react'

const TRAIL_COLOR = '138, 92, 246' // violet-ish "shadow monarch" glow
const TRAIL_LIFETIME = 420 // ms
const MAX_POINTS = 26

function SwordCursor() {
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)
  const pointsRef = useRef([])
  const mouse = useRef({ x: -100, y: -100 })
  const smooth = useRef({ x: -100, y: -100, angle: -45 })
  const rafRef = useRef(null)

  useEffect(() => {
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches
    if (isCoarsePointer) return

    document.body.classList.add('sl-cursor-active')

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

    const spawnSlash = (x, y) => {
      const burst = document.createElement('div')
      burst.className = 'sl-slash-burst'
      burst.style.left = `${x}px`
      burst.style.top = `${y}px`
      document.body.appendChild(burst)
      window.setTimeout(() => burst.remove(), 500)
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
      // Ease the cursor toward the real pointer for a light "trailing" feel
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.32
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.32

      const dx = mouse.current.x - lastX
      const dy = mouse.current.y - lastY
      const speed = Math.hypot(dx, dy)
      if (speed > 1.5) {
        const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 45
        let delta = targetAngle - smooth.current.angle
        delta = ((delta + 180) % 360) - 180
        smooth.current.angle += delta * 0.25
      }
      lastX = mouse.current.x
      lastY = mouse.current.y

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${smooth.current.x}px, ${smooth.current.y}px) rotate(${smooth.current.angle}deg)`
      }

      // Draw fading slash trail from recent points
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = performance.now()
      pointsRef.current = pointsRef.current.filter((p) => now - p.t < TRAIL_LIFETIME)
      const pts = pointsRef.current

      if (pts.length > 1) {
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1]
          const p1 = pts[i]
          const age = (now - p1.t) / TRAIL_LIFETIME
          const alpha = Math.max(0, 1 - age)
          const width = Math.max(0.5, 5.5 * (1 - age))

          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.lineCap = 'round'
          ctx.strokeStyle = `rgba(${TRAIL_COLOR}, ${alpha * 0.55})`
          ctx.lineWidth = width
          ctx.shadowColor = `rgba(${TRAIL_COLOR}, ${alpha * 0.9})`
          ctx.shadowBlur = 12
          ctx.stroke()
        }
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
          width="34"
          height="34"
          viewBox="0 0 34 34"
          style={{
            transform: 'translate(-6px, -26px)',
            filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.85)) drop-shadow(0 0 14px rgba(124,58,237,0.5))',
          }}
        >
          {/* blade */}
          <polygon
            points="8,2 12,2 14,22 6,22"
            fill="url(#slBladeGradient)"
            stroke="rgba(224,214,255,0.9)"
            strokeWidth="0.6"
          />
          {/* blade center glow line */}
          <line x1="10" y1="3" x2="10" y2="21" stroke="rgba(255,255,255,0.85)" strokeWidth="0.8" />
          {/* guard */}
          <rect x="3.5" y="22" width="13" height="2.4" rx="1" fill="#2b2440" stroke="#a78bfa" strokeWidth="0.5" />
          {/* grip */}
          <rect x="8.5" y="24.4" width="3" height="7" rx="1.2" fill="#1c1730" stroke="#6d28d9" strokeWidth="0.5" />
          {/* pommel */}
          <circle cx="10" cy="32" r="1.6" fill="#a78bfa" />
          <defs>
            <linearGradient id="slBladeGradient" x1="10" y1="2" x2="10" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f5f3ff" />
              <stop offset="45%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}

export default SwordCursor
