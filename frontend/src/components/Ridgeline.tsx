/**
 * Three layered mountain ridges, loosely after the Teton skyline seen from
 * the valley floor, in the manner of a vintage park poster. The front ridge
 * is filled with the band color so it runs straight into the footer below.
 * Decorative only.
 */
const FAR =
  'M0 120 L70 104 L140 112 L210 92 L290 100 L360 78 L430 90 L520 70 L600 84 L680 66 L760 80 L840 64 L930 82 L1010 72 L1100 90 L1190 80 L1280 96 L1280 160 L0 160 Z'

const MID =
  'M0 134 L90 122 L170 128 L250 108 L320 116 L380 92 L430 100 L470 70 L500 40 L520 58 L548 6 L574 44 L592 30 L616 62 L640 46 L676 86 L720 76 L770 100 L840 92 L910 110 L990 102 L1070 118 L1160 108 L1280 124 L1280 160 L0 160 Z'

const NEAR =
  'M0 146 L110 136 L210 142 L320 128 L420 138 L520 124 L640 136 L760 120 L880 134 L990 126 L1100 140 L1200 132 L1280 138 L1280 160 L0 160 Z'

export default function Ridgeline({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1280 160"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path d={FAR} style={{ fill: 'color-mix(in oklab, var(--data-blue) 30%, var(--page-bg))' }} />
      <path d={MID} style={{ fill: 'color-mix(in oklab, var(--data-teal) 55%, var(--band-bg))' }} />
      {/* Snow on the high peaks of the middle ridge. */}
      <path
        d="M548 6 L574 44 L562 40 L552 50 L540 34 L530 44 L534 32 Z M500 40 L520 58 L508 54 L496 60 L490 52 Z M592 30 L616 62 L604 56 L594 62 L586 44 Z M640 46 L660 68 L648 64 L636 70 L632 56 Z"
        style={{ fill: 'color-mix(in oklab, var(--band-text) 85%, transparent)' }}
      />
      <path d={NEAR} style={{ fill: 'var(--band-bg)' }} />
    </svg>
  )
}
