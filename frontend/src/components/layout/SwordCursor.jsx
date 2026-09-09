import { useEffect } from 'react'
import { tsParticles } from '@tsparticles/engine'
import { loadFull } from 'tsparticles'

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
  useEffect(() => {
    ensureEngine()

    const handleDown = (e) => {
      spawnShockwave(e.clientX, e.clientY)
      spawnEnergyBurst(e.clientX, e.clientY)
      triggerShake()
    }

    window.addEventListener('mousedown', handleDown)
    return () => window.removeEventListener('mousedown', handleDown)
  }, [])

  return null
}

export default SwordCursor
