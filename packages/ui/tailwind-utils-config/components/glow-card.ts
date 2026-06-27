/** Base halo gradient — phase-locked while idle (opacity 0); matches onboarding.html hover glow. */
const baseHaloGradient =
  'conic-gradient(from var(--cn-comp-glow-card-angle), transparent 42%, var(--cn-comp-glow-card-halo-base-stop-1) 49%, var(--cn-comp-glow-card-halo-base-stop-2) 53%, var(--cn-comp-glow-card-halo-base-stop-3) 57%, var(--cn-comp-glow-card-halo-base-stop-4) 62%, var(--cn-comp-glow-card-halo-base-stop-5) 66%, var(--cn-comp-glow-card-halo-base-stop-6) 70%, var(--cn-comp-glow-card-halo-base-stop-7) 74%, transparent 81%)'

/** Active ring — full-opacity stops; matches onboarding.html hover glow. */
const activeRingGradient =
  'conic-gradient(from var(--cn-comp-glow-card-angle), transparent 45%, var(--cn-comp-glow-card-ring-stop-1) 50%, var(--cn-comp-glow-card-ring-stop-2) 55%, var(--cn-comp-glow-card-ring-stop-3) 62%, var(--cn-comp-glow-card-ring-stop-4) 68%, var(--cn-comp-glow-card-ring-stop-5) 74%, transparent 81%)'

const reducedMotionHaloGradient =
  'conic-gradient(from var(--cn-comp-glow-card-reduced-angle), transparent 42%, var(--cn-comp-glow-card-halo-base-stop-1) 49%, var(--cn-comp-glow-card-halo-base-stop-2) 53%, var(--cn-comp-glow-card-halo-base-stop-3) 57%, var(--cn-comp-glow-card-halo-base-stop-4) 62%, var(--cn-comp-glow-card-halo-base-stop-5) 66%, var(--cn-comp-glow-card-halo-base-stop-6) 70%, var(--cn-comp-glow-card-halo-base-stop-7) 74%, transparent 81%)'

const reducedMotionRingGradient =
  'conic-gradient(from var(--cn-comp-glow-card-reduced-angle), transparent 45%, var(--cn-comp-glow-card-ring-stop-1) 50%, var(--cn-comp-glow-card-ring-stop-2) 55%, var(--cn-comp-glow-card-ring-stop-3) 62%, var(--cn-comp-glow-card-ring-stop-4) 68%, var(--cn-comp-glow-card-ring-stop-5) 74%, transparent 81%)'

/** Comma must sit between full selectors — not inside a shared prefix. */
const activeGlowHaloSelector =
  '.cn-glow-card:hover .cn-glow-card-halo, .cn-glow-card:has(.cn-glow-card-inner:focus-visible) .cn-glow-card-halo'

const activeGlowRingSelector =
  '.cn-glow-card:hover .cn-glow-card-ring, .cn-glow-card:has(.cn-glow-card-inner:focus-visible) .cn-glow-card-ring'

/** Phase-lock halo + ring via inherited `--cn-comp-glow-card-angle` (onboarding.html pointer variant). */
const activeGlowRootSelector =
  '.cn-glow-card:hover, .cn-glow-card:has(.cn-glow-card-inner:focus-visible)'

/** One hover/focus engagement: N full turns (or infinite), holds final angle until disengaged. */
const glowCardActiveRotation =
  'glow-card-rotate-angle var(--cn-comp-glow-card-duration) linear var(--cn-comp-glow-card-rotation-count) forwards'

/** Fade begins with the final sweep; invalid when rotation-count is infinite (no fade). */
const glowCardActiveFadeDelay =
  'calc(var(--cn-comp-glow-card-duration) * (var(--cn-comp-glow-card-rotation-count) - 1))'

const glowCardPaletteDefaults = {
  '--cn-comp-glow-card-color-blue': '#2563eb',
  '--cn-comp-glow-card-color-sky': '#93c5fd',
  '--cn-comp-glow-card-color-orange': '#f97316',
  '--cn-comp-glow-card-color-amber': '#f59e0b',
  '--cn-comp-glow-card-color-yellow': '#fef08a',
  '--cn-comp-glow-card-color-gold': '#fbbf24',
  '--cn-comp-glow-card-color-white': '#ffffff'
} as const

const glowCardHaloAlphaDefaults = {
  '--cn-comp-glow-card-halo-alpha-1': '27%',
  '--cn-comp-glow-card-halo-alpha-2': '26%',
  '--cn-comp-glow-card-halo-alpha-3': '35%',
  '--cn-comp-glow-card-halo-alpha-4': '73%',
  '--cn-comp-glow-card-halo-alpha-5': '93%',
  '--cn-comp-glow-card-halo-alpha-6': '73%',
  '--cn-comp-glow-card-halo-alpha-7': '47%'
} as const

const glowCardHaloStopDefaults = {
  '--cn-comp-glow-card-halo-base-stop-1':
    'color-mix(in srgb, var(--cn-comp-glow-card-color-blue) var(--cn-comp-glow-card-halo-alpha-1), transparent)',
  '--cn-comp-glow-card-halo-base-stop-2':
    'color-mix(in srgb, var(--cn-comp-glow-card-color-sky) var(--cn-comp-glow-card-halo-alpha-2), transparent)',
  '--cn-comp-glow-card-halo-base-stop-3':
    'color-mix(in srgb, var(--cn-comp-glow-card-color-orange) var(--cn-comp-glow-card-halo-alpha-3), transparent)',
  '--cn-comp-glow-card-halo-base-stop-4':
    'color-mix(in srgb, var(--cn-comp-glow-card-color-amber) var(--cn-comp-glow-card-halo-alpha-4), transparent)',
  '--cn-comp-glow-card-halo-base-stop-5':
    'color-mix(in srgb, var(--cn-comp-glow-card-color-yellow) var(--cn-comp-glow-card-halo-alpha-5), transparent)',
  '--cn-comp-glow-card-halo-base-stop-6':
    'color-mix(in srgb, var(--cn-comp-glow-card-color-gold) var(--cn-comp-glow-card-halo-alpha-6), transparent)',
  '--cn-comp-glow-card-halo-base-stop-7':
    'color-mix(in srgb, var(--cn-comp-glow-card-color-white) var(--cn-comp-glow-card-halo-alpha-7), transparent)'
} as const

const glowCardRingStopDefaults = {
  '--cn-comp-glow-card-ring-stop-1': 'var(--cn-comp-glow-card-color-blue)',
  '--cn-comp-glow-card-ring-stop-2': 'var(--cn-comp-glow-card-color-sky)',
  '--cn-comp-glow-card-ring-stop-3': 'var(--cn-comp-glow-card-color-white)',
  '--cn-comp-glow-card-ring-stop-4': 'var(--cn-comp-glow-card-color-orange)',
  '--cn-comp-glow-card-ring-stop-5': 'var(--cn-comp-glow-card-color-gold)'
} as const

export default {
  '.cn-glow-card': {
    '--cn-comp-glow-card-radius': 'var(--cn-rounded-4)',
    '--cn-comp-glow-card-halo-radius': 'calc(var(--cn-comp-glow-card-radius) + 6px)',
    '--cn-comp-glow-card-angle': '0deg',
    '--cn-comp-glow-card-reduced-angle': '225deg',
    '--cn-comp-glow-card-duration': '2.2s',
    '--cn-comp-glow-card-rotation-count': '3',
    '--cn-comp-glow-card-fade-duration': 'var(--cn-comp-glow-card-duration)',
    '--cn-comp-glow-card-halo-blur': '14px',
    '--cn-comp-glow-card-halo-opacity-idle': '0',
    '--cn-comp-glow-card-halo-opacity-active': '1',
    '--cn-comp-glow-card-halo-opacity-active-dark': '0.85',
    '--cn-comp-glow-card-ring-padding': '1px',
    '--cn-comp-glow-card-idle-ring': 'transparent',
    ...glowCardPaletteDefaults,
    ...glowCardHaloAlphaDefaults,
    ...glowCardHaloStopDefaults,
    ...glowCardRingStopDefaults,

    position: 'relative',
    width: '100%',
    isolation: 'isolate',
    overflow: 'visible'
  },

  '[data-theme="dark"] .cn-glow-card': {
    '--cn-comp-glow-card-halo-opacity-active': 'var(--cn-comp-glow-card-halo-opacity-active-dark)'
  },

  '.cn-glow-card-halo': {
    pointerEvents: 'none',
    position: 'absolute',
    inset: '-3px',
    /* z-index 0 (not -1): negative z-index + filter:blur() inside isolation:isolate
       composites the halo over card content in Chromium; bundle uses 0 + ring/inner at 1. */
    zIndex: '0',
    borderRadius: 'var(--cn-comp-glow-card-halo-radius)',
    opacity: 'var(--cn-comp-glow-card-halo-opacity-idle)',
    background: baseHaloGradient,
    filter: 'blur(var(--cn-comp-glow-card-halo-blur))',
    transition: 'opacity 0.5s ease'
  },

  '.cn-glow-card-ring': {
    position: 'relative',
    zIndex: '1',
    overflow: 'hidden',
    borderRadius: 'var(--cn-comp-glow-card-radius)',
    padding: 'var(--cn-comp-glow-card-ring-padding)',
    background: 'var(--cn-comp-glow-card-idle-ring)',

    /* Gradient border on a layer so opacity can fade without dimming card content. */
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '0',
      zIndex: '0',
      borderRadius: 'inherit',
      padding: 'var(--cn-comp-glow-card-ring-padding)',
      background: activeRingGradient,
      opacity: '0',
      pointerEvents: 'none'
    }
  },

  '.cn-glow-card-inner': {
    position: 'relative',
    zIndex: '1',
    overflow: 'hidden',
    borderRadius: 'var(--cn-comp-glow-card-radius)',
    /* Opaque surface blocks blurred halo bleed-through at the card face. */
    backgroundColor: 'var(--cn-bg-3)'
  },

  [activeGlowRootSelector]: {
    animation: glowCardActiveRotation
  },

  [activeGlowHaloSelector]: {
    opacity: 'var(--cn-comp-glow-card-halo-opacity-active)',
    background: baseHaloGradient,
    filter: 'blur(var(--cn-comp-glow-card-halo-blur))',
    animation: `glow-card-halo-fade-out var(--cn-comp-glow-card-fade-duration) linear ${glowCardActiveFadeDelay} forwards`
  },

  [activeGlowRingSelector]: {
    '&::before': {
      opacity: '1',
      background: activeRingGradient,
      animation: `glow-card-ring-fade-out var(--cn-comp-glow-card-fade-duration) linear ${glowCardActiveFadeDelay} forwards`
    }
  },

  /* GlowCard owns the border + halo; inner Card must not add its own. */
  '.cn-glow-card-inner > .cn-card': {
    border: 'none',
    backgroundColor: 'var(--cn-bg-3)',
    boxShadow: 'inset 0 0 0 1px var(--cn-border-2), var(--cn-shadow-3)'
  },

  '@media (prefers-reduced-motion: reduce)': {
    [activeGlowRootSelector]: {
      animation: 'none !important'
    },

    '.cn-glow-card-halo, .cn-glow-card-ring': {
      animation: 'none !important'
    },

    [activeGlowHaloSelector]: {
      background: reducedMotionHaloGradient
    },

    [activeGlowRingSelector]: {
      '&::before': {
        background: reducedMotionRingGradient
      }
    }
  }
}
